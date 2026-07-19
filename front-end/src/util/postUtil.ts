import type { CommentDtoRes } from "../types/post";

function countAllComments(comments: CommentDtoRes[]): number {
    let count = comments.length;
    comments.forEach(c => {
        if (c.childrenComment) {
            count += c.childrenComment.length;
        }
    });
    return count;
}

export default countAllComments;