export default class Utils {
  static isDesktop() {
    return window.innerWidth >= 1200;
  }

  static getBoxWidth(movieCardWidth, movieBoxGap) {
    const countMovieBox = Math.max(1, Math.floor(window.innerWidth / movieCardWidth));
    const totalWidthOfMovieBox = countMovieBox * movieCardWidth + (countMovieBox - 1) * movieBoxGap;
    return Math.floor(totalWidthOfMovieBox);
  }
}
