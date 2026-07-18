import type { CommentDtoRes } from "../types/post";

function countAllComments(comments: CommentDtoRes[]): number {
    let count = comments.length;
    comments.forEach(c => {
        if (c.childrenComments) {
            count += c.childrenComments.length;
        }
    });
    return count;
}

export default countAllComments;