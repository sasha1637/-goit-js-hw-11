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
  rootMargin: '500px',
  threshold: 1
}
const simpleLightbox = new SimpleLightbox('.gallery a', { captionDelay: 250, showCounter: false, captionsData: 'alt' })
const observer = new IntersectionObserver(onLoad, options);
refs.searchInput.addEventListener("submit", onSearchQuery);

function onSearchQuery(evt) {
  evt.preventDefault();
   refs.gallery.innerHTML=''
  searchQuery = evt.currentTarget.elements.searchQuery.value

  imageApi(searchQuery, page).then(
    data => {
      if (!data.hits.length) {
        
   return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
         
      }
      refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits))
      simpleLightbox.refresh()
      Notiflix.Notify.info(`"Hooray! We found ${data.totalHits} images."`)
      observer.observe(refs.target);

    }
  ).catch(err => console.log(err))

}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      imageApi(searchQuery, page).then(data => {
        refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits))
        scrollBy()
        simpleLightbox.refresh()
        if (page >= (data.totalHits / 40)) {
          observer.unobserve(refs.target)
          Notiflix.Notify.info('Для завантаження більше немає зображень')
        }
      })
    }
  })
}
function scrollBy() {
  const { height: cardHeight } = refs.gallery
    .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight ,
  behavior: "smooth",
});
}

