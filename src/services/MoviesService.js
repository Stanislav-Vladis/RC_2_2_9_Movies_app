const BEARER_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNGU0OTJjZGZhODljNzVmODc5NGJkNmY5ZTFhYzI5YSIsInN1YiI6IjY1YmQ3Y2YwODliNTYxMDE2MzZkMTRmZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1UCGnkVK-vZGAH6txfQXV0tV8IJS_hFTbZuDu46kiMQ';
const API_KEY = 'f4e492cdfa89c75f8794bd6f9e1ac29a';
const BASE_URL = 'https://api.themoviedb.org';
const SEARCH_REPOSITORIES = '/3/search/movie';
const GUEST_SESSION = '/3/authentication/guest_session/new';
const SET_RATING = '/3/movie/{-id-}/rating';
const RATED_MOVIES = '/3/guest_session/{-guest_session_id-}/rated/movies';
const GENRES = '/3/genre/movie/list';

export default class MoviesService {
  constructor() {
    this.apiKey = 'f4e492cdfa89c75f8794bd6f9e1ac29a';
    this.baseUrl = 'https://api.themoviedb.org/3';
  }

  setLastRequestTime = () => localStorage.setItem('lastRequestTime', new Date());

  async fetchJSON(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Ошибка при выполнении запроса ${url}`);
    }

    return response.json();
  }

  async createGuestSession() {
    const requestOptions = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: BEARER_TOKEN
      }
    };
    const url = new URL(BASE_URL + GUEST_SESSION);

    const data = await this.fetchJSON(url, requestOptions);
    this.setLastRequestTime();

    return data.guest_session_id;
  }

  async getAllMovies(searchValue = 'return', page = 1) {
    const requestOptions = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: BEARER_TOKEN
      }
    };

    const url = new URL(BASE_URL + SEARCH_REPOSITORIES);
    url.searchParams.set('query', searchValue);
    url.searchParams.set('include_adult', 'false');
    url.searchParams.set('page', page.toString());

    this.setLastRequestTime();
    return this.fetchJSON(url, requestOptions);
  }

  async addRating(id, rating) {
    const guestSessionId = localStorage.getItem('guestSessionId');
    const requestOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: `{"value":${rating}}`
    };

    const url = new URL(BASE_URL + SET_RATING.replace('{-id-}', id));
    url.searchParams.set('api_key', API_KEY);
    url.searchParams.set('guest_session_id', guestSessionId);

    if (guestSessionId) {
      this.setLastRequestTime();
      await this.fetchJSON(url, requestOptions);
    }
  }

  async getRatedMovies(pageValue = 1) {
    const guestSessionId = localStorage.getItem('guestSessionId');
    const requestOptions = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    };
    const url = new URL(BASE_URL + RATED_MOVIES.replace('{-guest_session_id-}', guestSessionId));
    url.searchParams.set('api_key', API_KEY);
    url.searchParams.set('sort_by', 'created_at.asc');
    url.searchParams.set('page', pageValue.toString());

    if (guestSessionId) {
      this.setLastRequestTime();
      return this.fetchJSON(url, requestOptions);
    }
    return {};
  }

  async getGenres() {
    const requestOptions = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: BEARER_TOKEN
      }
    };
    const url = new URL(BASE_URL + GENRES);
    url.searchParams.set('language', 'en');

    this.setLastRequestTime();
    return this.fetchJSON(url, requestOptions);
  }
}
