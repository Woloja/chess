document.addEventListener('DOMContentLoaded', async () => {
    const ChessGame = (await import(/* webpackChunkName: "chess-game" */ './modules/ChessGame')).default;

    new ChessGame('#root', { size: 5 });
});
