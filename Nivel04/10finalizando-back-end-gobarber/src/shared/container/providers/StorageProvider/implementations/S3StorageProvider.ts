import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
    private client: S3;

    constructor() {
        this.client = new aws.S3({
            region: 'sa-east-1',
        });
    }

    // recebe string file e retorna promise string
    public async saveFile(file: string): Promise<string> {
        // deixa o caminho pro arquivo original, pega caminho de dentro da pasta tmp
        // pra subir o arquivo pra dentro da database
        const originalPath = path.resolve(uploadConfig.tmpFolder, file); // mover de dentro da tmp

        // pega o tipo do arquivo (extensão)
        const ContentType = mime.getType(originalPath);

        if (!ContentType) {
            throw new Error('File not found');
        }

        // ler conteudo do arquivo
        const fileContent = await fs.promises.readFile(originalPath);
        // upload
        await this.client
            .putObject({
                Bucket: uploadConfig.config.aws.bucket, // nome do Bucket da amazon
                Key: file, // nome do arquivo q recebemos por param
                ACL: `public-read`, // permissões que vamos dar ao arquivo
                Body: fileContent, // conteúdo do arquivo
                ContentType, // tipo do arquivo
            })
            .promise();

        // remove arquivo totalmente
        await fs.promises.unlink(originalPath);
        // retorna o nome do arquivo salvo
        return file;
    }

    // recebe string file
    public async deleteFile(file: string): Promise<void> {
        await this.client
            .deleteObject({
                Bucket: uploadConfig.config.aws.bucket,
                Key: file,
            })
            .promise();
    }
}
export default DiskStorageProvider;
