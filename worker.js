import { Queue } from 'bull/lib/queue';
import imageThumbNail from 'image-thumbnail';
import dbClient from './utils/db';
import { ObjectID } from 'mongodb';
import { promises as fs } from 'fs';

const fileQueue = new Queue('fileQueue', 'redis://127.0.0.1:6379');

/*
 * Creates a new thumbnail from the parsed paramaters
 *
 * @params: width -> width of the thumbnail image
 * @params: localpath
 * @Return: Promise<Buffer & string>
 */
const thumbnail = async (width, localpath) => {
  const thumbnailImage = await imageThumbNail(localpath, { width });
  return thumbnailImage;
};

fileQueue.process(async (job, done) => {
  const { fileId } = job.data;
  const { userId } = job.data;

  if (!fileId) done(new Error('Missing fileId'));
  if (!userId) done(new Error('Missing userId'));

  const files = dbClient.db.collection('files');
  const idObject = new ObjectID(fileId);

  files.findOne({ _id: idObject }, async (error, file) => {
    if (!file) done(new Error('File not found'));
    else {
      const fileName = file.localPath;
      const thumbnail500 = await thumbnail(500, fileName);
      const thumbnail100 = await thumbnail(100, fileName);
      const thumbnail250 = await thumbnail(250, fileName);

      // Write to system
      const image500Path = `${file.localpath}_500`;
      const image250Path = `${file.localpath}_250`;
      const image100Path = `${file.localpath}_100`;

      await fs.writeFile(image500Path, thumbnail500);
      await fs.writeFile(image250Path, thumbnail250);
      await fs.writeFile(image100Path, thumbnail100);
      done();
    }
  });
});
