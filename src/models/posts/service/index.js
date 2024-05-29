import database from '../../../database.js';
import { UserService } from '../../users/service/index.js';
import { PostDto, PostsDto } from '../dto/index.js';

export class PostService {
  constructor() {
    this.userService = new UserService();
  }

  // props : CreateDto
  async createPost(props) {
    // I. 유저가 실제로 있는 유저인지 확인
    const user = await this.userService.findUserById(props.userId);

    const newPost = await database.post.create({
      data: {
        title: props.title, content: props.content, user: {
          connect: {
            id: user.id,
          },
        }, // 오호,,,
        tags: {
          createMany: {
            data: props.tags.map(tag => ({ name: tag })),
          },
        },
      },
    });

    return newPost.id;
  }

  // 부모 댓글
  // props : CreateCommentDto
  async createComment(props) {
    // I. 검증
    const user = await this.userService.findUserById(props.userId);
    const post = await database.post.findUnique({
      where: {
        id: props.postId,
      },
    });

    // user는 당연히 있음
    if (!post) throw { status: 404, message: '게시글을 찾을 수 없습니다.' };

    const newComment = await database.comment.create({
      data: {
        content: props.content, post: {
          connect: {
            id: post.id,
          },
        }, user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return newComment.id;
  }

  // 자식 댓글
  async createChildComment(props) {
    const user = await this.userService.findUserById(props.userId);

    const parentComment = await database.comment.findUnique({
      where: {
        id: props.parentCommentId,
      },
    });

    if (!parentComment) throw { status: 404, message: '부모 댓글을 찾을 수 없습니다.' };

    const newChildComment = await database.comment.create({
      data: {
        content: props.content, user: {
          connect: {
            id: user.id,
          },
        }, post: {
          connect: {
            id: parentComment.postId,
          },
        }, parentComment: {
          connect: {
            id: parentComment.id,
          },
        },
      },
    });

    return newChildComment.id;
  }

  // 게시글 목록 불러오기
  // 게시글 찾을 수도 있네!!
  async getPosts({ skip, take }, searchValue) {
    console.log(searchValue);
    const posts = await database.post.findMany({
      where: {
        title: {
          contains: searchValue ?? '',
        },
      },
      include: {
        user: true,
      },
      skip,
      take,
      orderBy: {
        // 최신 순
        createdAt: 'desc',
      },
    });

    const count = await database.post.count({
      // 얘도 같이
      where: {
        title: {
          contains: searchValue ?? '',
        },
      },
    });

    return {
      posts: posts.map(post => new PostsDto(post)),
      count,
    };
  }

  // 게시글 자세히 불러오기(댓글, 태그 포함)
  async getPost(id, user) {
    const post = await database.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          include: {
            user: true,
            childComments: {
              include: {
                user: true,
              },
            },
          },
        },
        tags: true,
        user: true,
        postLikes: true,
      },
    });

    // console.log(post, user)
    if (!post) throw { status: 404, message: '게시글을 찾을 수 없습니다.' };

    return new PostDto(post, user);
  }

  // 게시글 좋아요 생성
  async createPostLike(userId, postId) {
    // 게시글, 유저 찾기
    const user = await this.userService.findUserById(userId);
    const post = await database.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) throw { status: 404, message: '게시글을 찾을 수 없습니다.' };

    // 이전에 이미 좋아요 했는지를 찾아야 함.
    const isLiked = await database.postLike.findUnique({
      where: {
        userId_postId: {
          userId: user.id, postId: post.id,
        },
      },
    });

    // 아무 일도 안할거야
    if (isLiked) return;

    await database.postLike.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        }, post: {
          connect: {
            id: postId,
          },
        },
      },
    });
  }

  // 게시글 좋아요 취소
  async deletePostLike(userId, postId) {
    // 게시글, 유저 찾기
    const user = await this.userService.findUserById(userId);
    const post = await database.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) throw { status: 404, message: '게시글을 찾을 수 없습니다.' };

    // 이전에 이미 좋아요 했는지를 찾아야 함.
    const isLiked = await database.postLike.findUnique({
      where: {
        userId_postId: {
          userId: user.id, postId: post.id,
        },
      },
    });

    // 좋아요가 있을 때만 동작
    if (!isLiked) return;

    await database.postLike.delete({
      where: {
        userId_postId: {
          userId: user.id, postId: post.id,
        },
      },
    });
  }

  // 게시글 좋아요 생성 및 취소 - tryToLike(목표)
  async postLike(props) {
    const user = await this.userService.findUserById(props.userId);
    const post = await database.post.findUnique({
      where: {
        id: props.postId,
      },
    });

    if (!post) throw { status: 404, message: '게시글을 찾을 수 없습니다.' };

    // 백엔드도 체킹할거임
    const isLiked = await database.postLike.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: post.id,
        },
      },
    });

    // 좋아요를 하는 경우
    if (props.tryToLike && !isLiked) {
      await database.postLike.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          }, post: {
            connect: {
              id: post.id,
            },
          },
        },
      });
    }
    // 좋아요를 삭제하는 경우
    else {
      await database.postLike.delete({
        where: {
          userId_postId: {
            userId: user.id, postId: post.id,
          },
        },
      });
    }
  }

  // 게시글 수정하기  props: UpdateDto
  async updatePost(props) {
    const user = await this.userService.findUserById(props.userId);
    const post = await database.post.findUnique({
      where: {
        id: props.postId,
      },
    });

    if (!post) throw { status: 404, message: '게시글을 찾을 수 없습니다.' };

    // 다르면 권한 없음
    if (user.id !== post.userId) {
      throw { status: 403, message: '권한이 없음' };
    }

    // 태그 변경
    if (props.tags) {
      // 1. 태그를 모두 삭제하고, 새로 수정한 태그로 교체
      // 2. 기존에 있는 태그에서 중복되는 값만 제외하고 교체
      // 첫번째 쓴다잉~

      await database.tag.deleteMany({
        where: {
          postId: props.postId,
        },
      });

      await database.tag.createMany({
        data: props.tags.map(tag => ({
          name: tag,
          post: {
            connect: {
              id: post.id,
            },
          },
        })),
      });
    }

    await database.post.update({
      where: {
        id: post.id,
      },
      data: {
        title: props.title,
        content: props.content,
        // tags는 어떻게 바꿀 수 있을까 ? ********************
        // => 요롷게! 근데 무조건 tags가 존재한다는 가정이 있어야 사용가능
        // tags: {
        //   deleteMany: {
        //     postId: post.id,
        //   },
        //   createMany: {
        //     data: props.tags.map(tag => ({
        //       name: tag,
        //     })),
        //   },
        // },
      },
    });
  }

  // 댓글 수정하기  props: UpdateCommentDto
  async updateComment(props) {
    const user = await this.userService.findUserById(props.userId);
    const comment = await database.comment.findUnique({
      where: {
        id: props.id,
      },
    });

    if (!comment) throw { status: 404, message: '댓글을 찾을 수 없습니다.' };

    // 권한 없음
    if (user.id !== comment.userId) throw { status: 404, message: '권한이 없음' };

    await database.comment.update({
      where: {
        id: comment.id,
      },
      data: {
        content: props.content,
      },
    });
  }

  // 게시글 삭제
  async deletePost(postId, user) {
    const post = await database.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) throw { status: 404, message: '게시글을 찾을 수 없습니다.' };

    if (post.userId !== user.id) throw { status: 404, message: '권한이 없음' };

    await database.post.delete({
      where: {
        id: post.id,
      },
    });
  }

  // 댓글 삭제
  async deleteComment(commentId, user) {
    const comment = await database.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) throw { status: 404, message: '게시글을 찾을 수 없습니다.' };

    if (comment.userId !== user.id) throw { status: 404, message: '권한이 없음' };

    await database.comment.delete({
      where: {
        id: comment.id,
      },
    });
  }
}
