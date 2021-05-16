(() => {
    const searchButton = document.getElementById("search-button");
    const search = document.getElementById("search");
    let keyWord = ""
    const insta_list = document.querySelector(".insta_list")

    console.log(insta_list)

    searchButton.addEventListener("click", async () => {
        keyWord = search.value;

        // instagram で口コミ検索を行う
        const INSTAGRAM_USER_ID = "";
        const INSTAGRAM_ACCESS_TOKEN = "";

        // インスタグラムのハッシュタグ ID を返す API の URL
        // HttpMethod: GET
        // https://graph.facebook.com/ig_hashtag_search
        // user_id: インスタグラムのビジネスアカウント ID
        // access_token: インスタグラム API のアクセストークン（永久化する必要あり）
        // q: 知りたいハッシュタグキーワード
        const INSTAGRAM_HASHTAG_API_URL = `https://graph.facebook.com/ig_hashtag_search?user_id=${INSTAGRAM_USER_ID}&access_token=${INSTAGRAM_ACCESS_TOKEN}&q=${encodeURIComponent(keyWord)}`;
        const instagram_hashtag_response = await fetch(INSTAGRAM_HASHTAG_API_URL);
        const instagram_hashtag_result = await instagram_hashtag_response.json();

        console.log(instagram_hashtag_result)

        // インスタグラムのハッシュタグ検索の結果を返す API の URL
        // https://graph.facebook.com/{ハッシュタグID}/top_media
        // user_id: ビジネスユーザID
        // fields: id,media_type,media_url,permalink,caption
        // access_token: トークン
        if ("data" in instagram_hashtag_result) {
            // データは最大 10 個に限定
            const INSTAGRAM_SEARCH_API_URL = `https://graph.facebook.com/${instagram_hashtag_result["data"][0]["id"]}/top_media?user_id=${INSTAGRAM_USER_ID}&access_token=${INSTAGRAM_ACCESS_TOKEN}&fields=id,media_type,media_url,caption,permalink&limit=10`;
            const instagram_hashtag_search_response = await fetch(INSTAGRAM_SEARCH_API_URL);
            const instagram_hashtag_search_result = await instagram_hashtag_search_response.json();

            console.log(instagram_hashtag_search_result)

            insta_list.innerHTML = (instagram_hashtag_search_result.data)
                ? instagram_hashtag_search_result.data.map((e) => {

                    console.log(e)

                    // IMAGE と CAROUSEL_ALBUM が存在し、IMAGE のときだけサムネイル URL が返ってくるので分岐させる
                    return (e.media_type === "IMAGE") // <img src="${e.media_url}" alt="${e.permalink} の画像">
                        ? `<a target="_blank" href="${e.permalink}" class="sns-review-text"><p>${e.caption}</p></a>`
                        : `<a target="_blank" href="${e.permalink}" class="sns-review-text"><p>${e.caption}</p></a>`;
                }).join("")
                : '<p class="sns-review-text">検索結果はありませんでした</p>';
        }
    })

})()