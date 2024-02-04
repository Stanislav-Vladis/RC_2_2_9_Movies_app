const MovieDbClient = (() => {
    const BEARER_TOKEN = 'Bearer ...';
    const BASE_URL = 'https://api.themoviedb.org';
    const SEARCH_REPOSITORIES = '/3/search/movie';
    const FORBIDDEN_CHARTS_REGEX = /[?=&,]/;

    class Client {
        async getMoviesByKeyword(keyword, page = 1) {
            if (FORBIDDEN_CHARTS_REGEX.test(keyword) || keyword.trim().length <= 0) return {};
            const requestOptions = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: BEARER_TOKEN
                }
            };
            const url = new URL(BASE_URL + SEARCH_REPOSITORIES);
            url.searchParams.set('query', keyword);
            url.searchParams.set('include_adult', 'false');
            url.searchParams.set('page', page.toString());

            return fetch(url, requestOptions);
        }
    }
    return Client;
})();

export default MovieDbClient;