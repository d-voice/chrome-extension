import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (_, res) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab?.id !== undefined) {
        chrome.scripting.executeScript(
            {
                target: { tabId: tab.id },
                func: () => document.body.innerHTML // Body içeriğini alıyoruz
            },
            (results) => {
                const message = results[0].result; // Script sonucunu message olarak ayarla
                res.send({
                    message
                });
            }
        );
    } else {
        res.send({
            message: "Aktif sekme bulunamadı."
        });
    }
}

export default handler