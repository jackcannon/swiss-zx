import { $ } from 'zx';
import { getProgressBar, ms, progressBar } from 'swiss-ak';
import { $$ } from './$$';

$.verbose = false;

//<!-- DOCS: 300 -->

/**<!-- DOCS: ffmpegTools ##! -->
 * ffmpegTools
 */
export namespace ffmpegTools {
  // SWISS-DOCS-JSDOC-REMOVE-PREV-LINE

  /**<!-- DOCS: ffmpegTools.ffmpeg ### @ -->
   * ffmpeg
   *
   * - `ffmpeg`
   * - `ffmpegTools.ffmpeg`
   *
   * Wrapper for ffmpeg command that provides progress bar to track progress
   *
   * ```typescript
   * const progBarOpts = {}; // Same options as getProgressBar
   * await ffmpeg(() => $`ffmpeg -y -i ${a} ${b} -progress ${pr}`, pr, framesNum, progBarOpts);
   * ```
   * @param {() => ProcessPromise} [command=() => $`ffmpeg -progress pr.txt`]
   * @param {string} [progressFileName='pr.txt']
   * @param {number} [totalFrames=1]
   * @param {progressBar.ProgressBarOptions} [progressBarOpts={}]
   * @returns {Promise<void>}
   */
  export const ffmpeg = async (
    command: () => ProcessPromise = () => $`ffmpeg -progress pr.txt`,
    progressFileName: string = 'pr.txt',
    totalFrames: number = 1,
    progressBarOpts: progressBar.ProgressBarOptions = {}
  ) => {
    await $`echo "" > ${progressFileName}`;

    const ffmpegProcess = command();

    const tail = $`tail -f ${progressFileName}`.nothrow();

    const bar = getProgressBar(totalFrames, {
      showCount: true,
      showPercent: true,
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
        // await ffmpegProcess.kill();
        await $`rm -rf ${progressFileName}`;
      }
    }

    await ffmpegProcess;
  };

  /**<!-- DOCS: ffmpegTools.toFFmpegTimeFormat ### @ -->
   * toFFmpegTimeFormat
   *
   * - `ffmpegTools.toFFmpegTimeFormat`
   *
   * Convert a number of milliseconds to a time format usable by FFmpeg.
   *
   * ```typescript
   * ffmpegTools.toFFmpegTimeFormat(minutes(3)); // '03:00.000'
   * ffmpegTools.toFFmpegTimeFormat(minutes(3) + seconds(21)); // '03:21.000'
   * ffmpegTools.toFFmpegTimeFormat(minutes(3) + seconds(21) + 456); // '03:21.456'
   * ```
   * @param {ms} time
   * @returns {string}
   */
  export const toFFmpegTimeFormat = (time: ms) => new Date(time).toISOString().slice(14, 23);

  /**<!-- DOCS: ffmpegTools.getProbe ### @ -->
   * getProbe
   *
   * - `ffmpegTools.getProbe`
   *
   * Get the probe of a file as an object
   *
   * ```typescript
   * const probe = await getProbe('file.mp4'); // { width: 1280, height: 720, ... }
   * ```
   * @param {string} file
   * @returns {Promise<ProbeResult>}
   */
  export const getProbe = async (file: string): Promise<ProbeResult> => {
    const full = await $`ffprobe -select_streams v -show_streams ${file} 2>/dev/null | grep =`;

    const props = Object.fromEntries(
      full
        .toString()
        .split('\n')
        .map((line) => line.split('='))
    );

    const asNumber = (val: string): number => (Number.isNaN(Number(val)) ? 0 : Number(val));

    const framerate = asNumber(props.avg_frame_rate.split('/')[0]) / asNumber(props.avg_frame_rate.split('/')[1]);

    return {
      index: asNumber(props.index),
      codec_name: props.codec_name as string,
      codec_long_name: props.codec_long_name as string,
      profile: props.profile as string,
      codec_type: props.codec_type as string,
      codec_time_base: props.codec_time_base as string,
      codec_tag_string: props.codec_tag_string as string,
      codec_tag: asNumber(props.codec_tag),
      width: asNumber(props.width),
      height: asNumber(props.height),
      coded_width: asNumber(props.coded_width),
      coded_height: asNumber(props.coded_height),
      closed_captions: asNumber(props.closed_captions),
      has_b_frames: asNumber(props.has_b_frames),
      sample_aspect_ratio: props.sample_aspect_ratio as string,
      display_aspect_ratio: props.display_aspect_ratio as string,
      pix_fmt: props.pix_fmt as string,
      level: asNumber(props.level),
      color_range: props.color_range as string,
      color_space: props.color_space as string,
      color_transfer: props.color_transfer as string,
      color_primaries: props.color_primaries as string,
      chroma_location: props.chroma_location as string,
      field_order: props.field_order as string,
      timecode: props.timecode as string,
      refs: asNumber(props.refs),
      is_avc: props.is_avc as string,
      nal_length_size: asNumber(props.nal_length_size),
      id: props.id as string,
      r_frame_rate: props.r_frame_rate as string,
      avg_frame_rate: props.avg_frame_rate as string,
      time_base: props.time_base as string,
      start_pts: asNumber(props.start_pts),
      start_time: asNumber(props.start_time),
      duration_ts: asNumber(props.duration_ts),
      duration: asNumber(props.duration),
      bit_rate: asNumber(props.bit_rate),
      max_bit_rate: props.max_bit_rate as string,
      bits_per_raw_sample: asNumber(props.bits_per_raw_sample),
      nb_frames: asNumber(props.nb_frames),
      nb_read_frames: props.nb_read_frames as string,
      nb_read_packets: props.nb_read_packets as string,

      framerate
    };
  };

  /**<!-- DOCS: ffmpegTools.ProbeResult #### -->
   * ProbeResult
   *
   * - `ffmpegTools.ProbeResult`
   *
   * Note: this interface is a guide, and other properties may exist, and some may be have different types
   */
  export interface ProbeResult {
    index: number;
    codec_name: string;
    codec_long_name: string;
    profile: string;
    codec_type: string;
    codec_time_base: string;
    codec_tag_string: string;
    codec_tag: number;
    width: number;
    height: number;
    coded_width: number;
    coded_height: number;
    closed_captions: number;
    has_b_frames: number;
    sample_aspect_ratio: string;
    display_aspect_ratio: string;
    pix_fmt: string;
    level: number;
    color_range: string;
    color_space: string;
    color_transfer: string;
    color_primaries: string;
    chroma_location: string;
    field_order: string;
    timecode: string;
    refs: number;
    is_avc?: string;
    nal_length_size?: number;
    id: string;
    r_frame_rate: string;
    avg_frame_rate: string;
    time_base: string;
    start_pts: number;
    start_time: number;
    duration_ts: number;
    duration: number;
    bit_rate: number;
    max_bit_rate: string;
    bits_per_raw_sample: number;
    nb_frames: number;
    nb_read_frames: string;
    nb_read_packets: string;

    framerate: number;
  }

  /**<!-- DOCS: ffmpegTools.getProbeValue ### @ -->
   * getProbeValue
   *
   * - `ffmpegTools.getProbeValue`
   *
   * Get a value from ffprobe output
   *
   * ```typescript
   * const probe = await getProbe('file.mp4', 'width'); // '1280'
   * ```
   * @param {string} file
   * @param {string} propertyName
   * @returns {Promise<string>}
   */
  export const getProbeValue = async (file: string, propertyName: string): Promise<string> =>
    (await $`ffprobe -select_streams v -show_streams ${file} 2>/dev/null | grep ${propertyName} | head -n 1 | sed -e 's/.*=//'`).toString();

  /**<!-- DOCS: ffmpegTools.getTotalFrames ### @ -->
   * getTotalFrames
   *
   * - `ffmpegTools.getTotalFrames`
   *
   * Get the total number of frames in a video file.
   *
   * ```typescript
   * const num = await getTotalFrames('video.mp4'); // 120 (2 secs at 60fps)
   * ```
   * @param {string | string[]} [list]
   * @returns {Promise<number>}
   */
  export const getTotalFrames = async (list?: string | string[]): Promise<number> => {
    if (!list) {
      list = (await $$.ls()).filter((file) => file.endsWith('.MOV'));
    }
    if (!(list instanceof Array)) list = [list];

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
} // SWISS-DOCS-JSDOC-REMOVE-THIS-LINE

/**<!-- DOCS-ALIAS: ffmpegTools.ffmpeg -->*/
export const ffmpeg = ffmpegTools.ffmpeg;
