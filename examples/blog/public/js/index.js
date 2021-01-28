/**
 * Javascript Handler Event
 * 
 * @url 127.0.0.1:3000/
 */
const tutorial = document.querySelector('.article');
const removeTag = document.querySelectorAll('.remove-tag');

const showTutorial = () => {
  if (tutorial == null) {
    return false;
  }
  let before = tutorial.hasChildNodes('before') ? tutorial.querySelector('.before') : null,
    after = tutorial.hasChildNodes('after') ? tutorial.querySelector('.after') : null,
    date = new Date(),
    timeout = date.getMilliseconds();
  
  setTimeout(() => {
    if (before == null) {
      return false;
    } else {
      if (!before.classList.contains('hidden') && typeof after.querySelector('.remove-tag') != undefined) {
        before.classList.add('hidden');
        after.style.display = "block";
      }
    }
  }, timeout);
};

showTutorial();

removeTag.forEach(tag => tag.innerHTML = tag.innerText);