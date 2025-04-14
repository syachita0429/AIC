function createCancellationMessage(event_id, event_name, event_date, event_image) {
    // return {
    //     type: "flex",
    //     // altTextはFlexMessageが見られない環境のみで表示、通常は無視
    //     altText: `${event_name}の申し込みをキャンセルしますか？`,
    //     contents:

    return {
            type: "bubble",
            hero: {
                type: "image",
                url: event_image,
                size: "full",
                aspectRatio: "1:1.4",
                aspectMode: "cover"
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: event_name,
                        weight: "bold",
                        size: "lg",
                        wrap: true
                    },
                    {
                        type: "text",
                        text: event_date,
                        size: "sm",
                        color: "#666666",
                        wrap: true,
                        margin: "md"
                    }
                ]
            },
            footer: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                    {
                        type: "button",
                        style: "primary",
                        color: "#FF6666",
                        action: {
                            type: "postback",
                            label: "キャンセルへすすむ",
                            data: JSON.stringify({
                                event_id: event_id,
                                event_name: event_name,
                                action: "申込内容を消去します。"
                            }),
                            displayText: "申込内容を消去します。"                        }
                    }
                ]
            }
        }
    };
