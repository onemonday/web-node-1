window.addEventListener('load', function() {
    resizeWelcomeDiv();
});

window.addEventListener('resize', function() {
    resizeWelcomeDiv();
});

function resizeWelcomeDiv() {
    const welcomeDiv = document.querySelector('.welcome');
    const windowHeight = window.innerHeight;
    const minHeight = 500; // примерная минимальная высота в пикселях

    welcomeDiv.style.height = Math.max(windowHeight * 0.8, minHeight) + 'px';
    welcomeDiv.style.backgroundSize = 'cover';


}
