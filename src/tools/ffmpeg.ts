import { getProgressBar, ProgressBarOptions } from 'swiss-ak';
import { ls } from './$_';

export const getProbeValue = async (file: string, propertyName: string): Promise<string> =>
  (await $`ffprobe -select_streams v -show_streams ${file} 2>/dev/null | grep ${propertyName} | head -n 1 | sed -e 's/.*=//'`).toString();

export const getProbe = async (file: string, props?: string[]): Promise<{ [key: string]: string | number }> => {
  const full = await $`ffprobe -select_streams v -show_streams ${file} 2>/dev/null | grep =`;

  return Object.fromEntries(
    full
      .toString()
      .split('\n')
      .map((line) => line.split('='))
      .filter(([key]) => !props || props.includes(key))
      .map(([key, value]) => {
        let newValue = value;

        // @ts-ignore
        if (!Number.isNaN(Number(newValue))) newValue = Number(newValue);

        return [key, newValue];
      })
  );
};

export const getTotalFrames = async (list: string[]): Promise<number> => {
  if (!list) {
    list = (await ls()).filter((file) => file.endsWith('.MOV'));
  }

  const counts = await Promise.all(list.map(async (file) => getProbeValue(file, 'nb_frames')));

  const totalFrames = counts.map((count) => Number(count.trim())).reduce((acc, cur) => acc + cur, 0);

  return totalFrames;
};

const readChunk = (chunk) =>
  Object.fromEntries(
    chunk
      .toString()
      .split('\n')
      .filter((row) => row && row.includes('='))
      .map((row) =>
        row
          .split('=')
          .map((str) => str.trim())
          .slice(0, 2)
      )
  );

export const ffmpeg = async (
  command: () => ProcessPromise = () => $`ffmpeg -progress pr.txt`,
  progressFileName: string = 'pr.txt',
  totalFrames: number = 1,
  progressBarOpts: ProgressBarOptions = {}
) => {
  await $`echo "" > ${progressFileName}`;

  const ffmpegProcess = command();

  const tail = $`tail -f ${progressFileName}`.nothrow();

  const bar = getProgressBar(totalFrames, {
    showCount: true,
    showPercent: true,
    chalk,
    wrapperFn: chalk.magenta,
    ...progressBarOpts
  });

  for await (const chunk of tail.stdout) {
    const progStats = readChunk(chunk);

    if (!progStats || !progStats.frame) {
      continue;
    }

    const frame = Number(progStats.frame);
    bar.set(frame);

    if (progStats.progress === 'end') {
      bar.finish();
      await tail.kill();
      await ffmpegProcess.kill();
      await $`rm -rf ${progressFileName}`;
    }
  }

  await ffmpegProcess;
};
