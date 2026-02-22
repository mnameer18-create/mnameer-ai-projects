import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { DocumentsService } from './documents.service';
import { CurrentUser } from '../common/current-user.decorator';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private documents: DocumentsService) {}

  @Post('upload/:employeeId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './apps/api/storage',
      filename: (_, file, cb) => cb(null, `${Date.now()}${extname(file.originalname)}`),
    }),
  }))
  upload(@CurrentUser() user: any, @Param('employeeId') employeeId: string, @UploadedFile() file: Express.Multer.File, @Body('type') type: string) {
    return this.documents.upload(user, employeeId, type, file.path);
  }

  @Get(':employeeId')
  list(@Param('employeeId') employeeId: string) { return this.documents.list(employeeId); }

  @Get('download/:id')
  async download(@Param('id') id: string, @CurrentUser() user: any, @Res() res: Response) {
    const { doc, stream } = await this.documents.stream(id, user);
    res.setHeader('Content-Disposition', `attachment; filename=${doc.type}.pdf`);
    stream.pipe(res);
  }
}
