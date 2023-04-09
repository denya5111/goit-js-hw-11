export function fetchData(searchValue, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '35208101-7d8b3c980f14c23bd79891302';
  const url = `${BASE_URL}?key=${API_KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}
