export const routes =
{
    test: '/',
    texture: {
        addFile: '/texture',
        uploadData: '/texture/upload',
    },
    post: {
        timeline: 'post/timeline',
        lastPost: 'post/lastPost',
        upload: 'post/upload',
        register: 'post/register',
    },
    article: {
        getArticle: '/article',
        createArticle: '/article/create',
        checkTitleAvailability: '/article/check',
    },
    image: {
        getImage: '/image',
    },
    user: {
        register: '/user/register',
    }
}