import type { VoiceToAnswerModel } from "~models/voiceToAnswer";

const BASE_URL = "https://localhost:7182/api/";

export class BackendService {
    public async voiceToAnswer(model: VoiceToAnswerModel): Promise<Blob> {
        const formData = new FormData();
        formData.append("AudioBlob", model.AudioBlob, "audio.wav");
        formData.append("WebBody", model.WebBody);

        const response = await fetch(BASE_URL + "HealthCheck", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        console.log("Response from backend:", response);
        // Yanıtı doğrudan Blob olarak döndürüyoruz
        return response.blob();
    }

}
