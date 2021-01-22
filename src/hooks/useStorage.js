import {watchEffect,ref} from 'vue'
import {storage} from '../FIREBASE'
export default (file)=>{
    const progress = ref(null)
    const error = ref(null)
    const url = ref(null)

    watchEffect(async()=>{
      
        const storageRef =  storage.ref(file.name);
         storageRef.put(file).on('state_changed',(snap)=>{
            let percentage = (snap.bytesTransferred / snap.totalBytes) * 100
             progress.value =  Math.floor(percentage) 
             
            if (progress.value == 100) {
                progress.value = null
            }
        },(err)=> error.value = err,
        async()=>{
            const URL = await storageRef.getDownloadURL()
            url.value = URL
        })
        
    },file)
    
    return {progress,
        error,
        url}
}