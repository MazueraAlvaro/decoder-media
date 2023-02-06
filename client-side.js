const getVideoChunks = async (url) => {
  let bytesEnd = 0;
  let endBytesContent = -1;
  const name = new Date().getTime();

  do {
    const response = await performFetch(url, endBytesContent + 1);
    const [rangeContent, endMedia] = response.headers
      .get("Content-Range")
      .split("/");
    const [, endContent] = rangeContent.split("-");
    bytesEnd = parseInt(endMedia);

    await sendToEncoder(
      await response.blob(),
      endBytesContent == -1,
      parseInt(endContent) + 10 > bytesEnd,
      name
    );
    endBytesContent = parseInt(endContent);
  } while (endBytesContent + 10 < bytesEnd);
};

const sendToEncoder = (text, start, end, name) => {
  return fetch("http://localhost:3000", {
    method: "POST",
    headers: {
      "Content-Type": "video/mp4",
      "X-start": start,
      "X-end": end,
      "X-name": name,
    },
    body: text,
  });
};

const performFetch = (url, bytesFrom) => {
  return fetch(url, {
    headers: {
      range: "bytes=" + bytesFrom + "-",
      "sec-ch-ua":
        '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      Referer: "https://web.telegram.org/k/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: null,
    method: "GET",
  });
};
