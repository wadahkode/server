let container = document.querySelector('.main');
let username = document.querySelector('.session-username');
let sideUrl = [
  {
    admin: {
      tutorial: 'admin-tutorial'
    }
  }
];

sideUrl.forEach(url => {
  let item = document.querySelector('.' + url.admin.tutorial);

  item.querySelector('button').onclick = async () => {
    container.innerHTML = await formTutorial('/' + url.admin.tutorial.replace('-', '/'));
    tinymce.init({
      selector: '.editor',
      height: 300,
      plugins: 'autolink image table paste preview lists nonbreaking code emoticons',
      nonbreaking_force_tab: true,
      toolbar: 'undo redo | styleselect | bold italic | ' +
        'alignleft aligncenter alignright alignjustify | ' +
        'outdent indent | numlist bullist | emoticons',
      emoticons_append: {
        custom_mind_explode: {
          keywords: ['brain', 'mind', 'explode', 'blown'],
          char: '🤯'
        }
      },
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      tinycomments_author: 'wadahkode official',
    });
    username.parentElement.style.display = "none";
  };
});

const formTutorial = url => /*html*/`
  <h1 class="text-lg font-bold mb-3">Buat tutorial</h1>
  <form action="${url}" class="bg-gray-100 border py-2 px-3" method="POST">
    <div>
      <legend>Judul</legend>
      <input type="text" name="judul" class="border rounded px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-300" placeholder="masukan judul"/>
    </div>
    <div class="my-3">
      <legend>Kategori</legend>
      <select name="kategori" class="border rounded px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-300">
        <option value="">Pilih kategori</option>
        <option value="games">Game</option>
        <option value="programing">Programing</option>
      </select>
    </div>
    <div name="editor" class="mt-3 editor"></div>
    <div class="mt-3">
      <legend>Penulis</legend>
      <input type="text" name="penulis" class="border rounded px-4 py-2 d-none" value="${username.innerHTML}"/>
    </div>
    <div class="mt-5">
      <button type="submit" class="border rounded bg-blue-600 p-1 w-24 text-white">Kirim</button>
    </div>
  </form>
`;

if (container.hasChildNodes('.editor')) {
  // alert(true)
  tinymce.init({
    selector: '.editor',
    height: 300,
    plugins: 'autolink image table paste preview lists nonbreaking code emoticons',
    nonbreaking_force_tab: true,
    toolbar: 'undo redo | styleselect | bold italic | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'outdent indent | numlist bullist | emoticons',
    emoticons_append: {
      custom_mind_explode: {
        keywords: ['brain', 'mind', 'explode', 'blown'],
        char: '🤯'
      }
    },
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    tinycomments_author: 'wadahkode official',
  });
}

const removeTag = document.querySelectorAll('.remove-tag');
removeTag.forEach(tag => {
  let text = tag.innerText;

  tag.innerHTML = text;
})