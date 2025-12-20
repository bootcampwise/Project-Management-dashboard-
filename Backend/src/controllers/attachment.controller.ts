import { Request, Response, NextFunction } from "express";
import { AttachmentService } from "../services/attachment.service";
import { sendSuccess } from "../utils/response";

const attachmentService = new AttachmentService();

export class AttachmentController {
  async createAttachment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new Error("No file uploaded");
      }
      const { taskId } = req.body;
      const attachment = await attachmentService.createAttachment({
        filename: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        size: req.file.size,
        mimeType: req.file.mimetype,
        taskId,
      });
      sendSuccess(res, attachment, "Attachment uploaded successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteAttachment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await attachmentService.deleteAttachment(id);
      sendSuccess(res, null, "Attachment deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  async getTaskAttachments(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const attachments = await attachmentService.getTaskAttachments(taskId);
      sendSuccess(res, attachments);
    } catch (error) {
      next(error);
    }
  }
}
