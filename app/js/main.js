'use strict'

/////////////////////////////////////////////////////////////////////////
//функция показа истории (видео)
function showStory (modalStory){

    //делаю видимым всплывающее окно
    modalStory.classList.add('modal-story--visible');

    //получаем все для воспроизведения
    const modalVideo = modalStory.querySelector('.modal-story__video');
    const playBtn = modalStory.querySelector('.modal-story__play');
    const progress = modalStory.querySelector('.modal-story__progress');

    //устанавливаем действия при воспроизведении
    function playClick(){
        if (modalVideo.paused){
            modalVideo.play();
        } else {
            modalVideo.pause();
        }
    }

    playBtn.addEventListener('click', playClick);

    //заполняем прогресс бар
    function progressFill(){
        progress.style.width = modalVideo.currentTime / modalVideo.duration * 100 + '%';
    }
    modalVideo.addEventListener('timeupdate', progressFill);

    //изменение кнопки play pause
    modalVideo.addEventListener('play', () => {
        playBtn.classList.remove('modal-story__play');
        playBtn.classList.add('modal-story__pause');
    });
    modalVideo.addEventListener('pause', ()=>{
        playBtn.classList.remove('modal-story__pause');
        playBtn.classList.add('modal-story__play');
    });

    //устанавливаю событие на закрытие
    //одновременно завершаю функцию
    return modalStory.addEventListener('click', (event) => {
        if (event.target.matches('.modal-story__body')){
            //делаю окно невидимым
            modalStory.classList.remove('modal-story--visible');

            //устанавливаем время воспроизведения в начальную позицию
            modalVideo.currentTime = 0.0;
            //ставим на паузу
            modalVideo.pause();

            //и удаляем listner по клику на кнопку, т.к. без этого при
            //повторном открытии не будет проигрываться видео
            playBtn.removeEventListener('click', playClick);

            //выходим из данного листнера, так же завершая функцию
            return;
        }
    });
};

//управление модальным окном для сториз
if (document.querySelector('.blog-stories')) {
    const blogStories = document.querySelector('.blog-stories');
    blogStories.addEventListener('click', (event) => {
        //получаем все истории
        let items = blogStories.querySelectorAll('.blog-stories__item');

        //определяю номер истории
        let numberStory;
        for(let i = 0; i < items.length; i++){
            if (items[i].contains(event.target)){
                numberStory = i;
                break;
            }
        }

        //передаем для работу найденную историю в функцию показа
        return showStory(document.getElementById(`modal-story-${numberStory + 1}`));
    });
};


/////////////////////////////////////////////////////////////////////////////////////


//открытие меню по нажатию на кнопку бургер
if (document.querySelector('.menu-burger')){
    const burgerMenu = document.querySelector('.menu-burger__menu');
    document.addEventListener('click', (event) => {
        if(event.target.closest('.menu-burger__btn')){
            burgerMenu.classList.toggle('menu-burger__menu--visible');
        } else if (!event.target.closest('.menu-burger__menu')){
                burgerMenu.classList.remove('menu-burger__menu--visible');
        }
    });


    //выпадающее меню для ссылок в бургер меню
    const buttonArticles = document.querySelector('.menu-burger__link-first');
    const menuArticles = document.querySelector('.menu-burger__articles');

    buttonArticles.addEventListener('click', (event) => {
        menuArticles.classList.toggle('menu-burger__articles--visible');
        buttonArticles.classList.toggle('menu-burger__link-first--active');
    });

    if (location.href.search('index.html') > 0){
        const burgerSearch = document.querySelector('.menu-burger__search');
        burgerSearch.classList.add('menu-burger--main-page');
    }
};

/////////////////////////////////////////////////////////////////////////////////
