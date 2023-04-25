import React from "react"
import DicomAnonymizerService from "../../services/dicom-anonymizer.service"

class Upload {
    async uploadFiles(file, isDicom) {
        let uid = null

        if (isDicom) {
            // Изображения формата .dcm должны быть анонимизированы.
            let dicomContAndUID = await DicomAnonymizerService.anonymizeInstance(file)
            let anonymizedDicomBlobArrayBuff = dicomContAndUID.dicom
            uid = dicomContAndUID.UID
            const blob = new Blob([anonymizedDicomBlobArrayBuff])
            let readerPromise = new Promise((resolve, reject) => {
                let reader = new FileReader()
                reader.onload = () => {
                    resolve(reader.result)
                }
                reader.onerror = reject
                reader.readAsDataURL(blob)
            })
            // Для отправления файлов по websocket, необходимо перевести их в строку base64.
            const fileStringBase64 = await readerPromise
            return {name: file.name, uid: uid, image: fileStringBase64}
        } else {
            let readerPromise = new Promise((resolve, reject) => {
                let reader = new FileReader()
                reader.onload = () => {
                    resolve(reader.result)
                }
                reader.onerror = reject
                reader.readAsDataURL(file)
            })
            // Для отправления файлов по websocket, необходимо перевести их в строку base64.
            const fileStringBase64 = await readerPromise
            return {name: file.name, uid: uid, image: fileStringBase64}
        }
    }
}

export default new Upload