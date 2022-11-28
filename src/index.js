import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import createMarkup from './js/createMarkup'
import imageApi from './js/api'
import refs from './js/refs'
let page = 1;
let searchQuery = ''
const options = {
  root: null,
  rootMargin: '1000px',
  threshold: 1
}
const simpleLightbox = new SimpleLightbox('.gallery a', { captionDelay: 250, showCounter: false, captionsData: 'alt' })

const observer = new IntersectionObserver(onLoad, options);
refs.searchInput.addEventListener("submit", onSearchQuery);

function onSearchQuery(evt) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.elements.searchQuery.value

  imageApi(searchQuery, page).then(
    data => {
      if (!data.hits.length) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
      }
      refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits))
      console.log(simpleLightbox);
      simpleLightbox.refresh()
      Notiflix.Notify.info(`"Hooray! We found ${data.totalHits} images."`)
      observer.observe(refs.target);
const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
    }
  ).catch(err => console.log(err))

}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      imageApi(searchQuery, page).then(data => {
        refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits))
        simpleLightbox.refresh()
        if (page >= (data.totalHits / 40)) {
          observer.unobserve(refs.target)
        }
      })
    }
  })
}


// const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 102,
//   behavior: "smooth",
// });