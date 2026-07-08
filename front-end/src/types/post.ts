export interface Post {
    postId: number;
    username: string;
    date: string;
    subject: string;
    content: string;
}

export interface HomeProps {
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}