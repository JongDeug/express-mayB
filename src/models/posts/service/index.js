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
    console.log(searchValue)
    const posts = await database.post.findMany({
      where: {
        title: {
          contains: searchValue ?? "",
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
          contains: searchValue ?? "",
        },
      },
    });

    return {
      posts: posts.map(post => new PostsDto(post)),
      count,
    };
  }

  // 게시글 자세히 불러오기(댓글, 태그 포함)
  async getPost(id) {
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
      },
    });

    if (!post) throw { status: 404, message: '게시글을 찾을 수 없습니다.' };

    return new PostDto(post);
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
}
