import { gql } from 'apollo-boost'

// User Queries
export const GET_CURRENT_USER = gql`
    query {
        getCurrentUser {
            _id
            username
            email
            password
            avatar
            joinDate
            favorites {
                _id
                title
                artist
                album
            }
            disliked {
                _id
                combine
            }
        }
    }
`

// User Mutations
export const SIGNIN_USER = gql`
    mutation($username: String!, $password: String!) {
        signinUser(username: $username, password: $password) {
            token
        }
    }
`

export const SIGNUP_USER = gql`
    mutation($username: String!, $email: String! $password: String!) {
        signupUser(username: $username, email: $email, password: $password) {
            token
        }
    }
`

// Song Queries
export const GET_SONGS = gql`
    query {
        getSongs {
            _id
            title
            artist
            album
            picture
            duration
            minsec
            songid
            feedback {
                likes
                dislikes
            }
        }
    }
`

export const GET_SONG = gql`
    query($songId: ID!) {
        getSong(songId: $songId) {
            _id
            title
            artist
            album
            picture
            duration
            minsec
            songid
            feedback {
                likes
                dislikes
            }
        }
    }
`