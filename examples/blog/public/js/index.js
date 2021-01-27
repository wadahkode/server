/**
 * Javascript Handler Event
 * 
 * @url 127.0.0.1:3000/
 */
const article = document.querySelector('.article');
setTimeout(() => {
  let before = article.querySelector('.before'),
    after = article.querySelector('.after');

  if (!before.classList.contains('hidden') && typeof after.querySelector('.remove-tag') != undefined) {
    before.classList.add('hidden');
    after.style.display = "block";
  }
}, 500);

const removeTag = document.querySelectorAll('.remove-tag');
removeTag.forEach(tag => {
  let text = tag.innerText;

  tag.innerHTML = text;
})