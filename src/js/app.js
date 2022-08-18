document.addEventListener('DOMContentLoaded', async () => {
    const ChessGame = (await import(/* webpackChunkName: "chess-game" */ './modules/ChessGame/index')).default;

    const instance = new ChessGame('#root', { size: 5 });

    document.querySelector('#start').addEventListener('click', () => {
        instance.start();
    });
});
