import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchData } from './api/api';
import { createMarkup } from './createMarkup';

const searchInputEl = document.querySelector('input');
const searchButtonEl = document.querySelector('[type="submit"]');
const galleryListEl = document.querySelector('.gallery_list');
const loadMoreButtonEl = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a');

let searchValue = '';
let pageCounter = 0;
let markup;
let quantityImage = 0;

loadMoreButtonEl.classList.add('hidden');
searchButtonEl.addEventListener('click', handleClickSearchButton);
loadMoreButtonEl.addEventListener('click', handleClickLoadMoreButton);

function handleClickSearchButton(e) {
  e.preventDefault();
  searchValue = searchInputEl.value.trim();
  if (!searchValue) {
    return Notify.failure('Please enter valid search data!');
  }
  pageCounter = 1;
  fetchData(searchValue, pageCounter)
    .then(data => {
      galleryListEl.innerHTML = '';
      if (data.hits.length === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      searchInputEl.value = '';
      loadMoreButtonEl.classList.add('hidden');
      Notify.info(`Hooray! We found ${data.totalHits} images.`);

      markup = createMarkup(data);

      galleryListEl.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
      quantityImage = data.totalHits;
      if (quantityImage >= 40) {
        loadMoreButtonEl.classList.remove('hidden');
      }
    })
    .catch(error => console.log(error));
}

function handleClickLoadMoreButton() {
  pageCounter += 1;
  fetchData(searchValue, pageCounter)
    .then(data => {
      markup = createMarkup(data);
      console.log(pageCounter);
      galleryListEl.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
      if (quantityImage / pageCounter <= 40) {
        loadMoreButtonEl.classList.add('hidden');
        pageCounter = 0;
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })

    .catch(error => console.log(error));
}
