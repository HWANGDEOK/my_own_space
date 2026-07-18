package com.hyeondeok.back_end.repository;

import com.hyeondeok.back_end.entity.Post;
import com.hyeondeok.back_end.entity.PostState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByStateOrderByPostIdDesc(PostState state);
}
