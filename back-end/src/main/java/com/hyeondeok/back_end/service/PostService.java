package com.hyeondeok.back_end.service;

import com.hyeondeok.back_end.dto.PostDto;
import com.hyeondeok.back_end.entity.Post;
import com.hyeondeok.back_end.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;


    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post createPost(PostDto dto) {
        return postRepository.save(dto.toEntity());
    }


}
