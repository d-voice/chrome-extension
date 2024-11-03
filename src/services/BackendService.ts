
const BASE_URL = "https://api.dvoice.com";

export class BackendService {
    public async voiceToAnswer(audioBlob: Blob): Promise<any> {
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.wav");

        const response = await fetch(BASE_URL + "/voice-to-answer", {
            method: "POST",
            body: formData,
            headers: {
                // Eğer sunucu özel bir header beklemiyorsa Content-Type belirtme
                // Browser otomatik olarak `multipart/form-data` kullanacak.
            }
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        return response.json();
    }
}