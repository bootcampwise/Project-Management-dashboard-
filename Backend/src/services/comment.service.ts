import { CommentRepository } from "../repositories/comment.repository";

export class CommentService {
  private commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async createComment(data: {
    content: string;
    taskId: string;
    authorId: string;
  }) {
    if (!data.content) {
      throw new Error("Comment content is required");
    }
    return this.commentRepository.create(data);
  }

  async getTaskComments(taskId: string) {
    return this.commentRepository.findByTaskId(taskId);
  }

  async updateComment(id: string, content: string, userId: string) {
    // TODO: Add authorization check
    return this.commentRepository.update(id, content);
  }

  async deleteComment(id: string, userId: string) {
    // TODO: Add authorization check
    return this.commentRepository.delete(id);
  }
}
