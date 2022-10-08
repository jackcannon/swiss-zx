interface KeyListener {
  start(): void;
  stop(): void;
}

export const getKeyListener = (callback: (keyName) => void, isStart: boolean = true, isDebugLog: boolean = false): KeyListener => {
  const listenFn = (key: any) => {
    if (isDebugLog) {
      console.log(JSON.stringify(key)); // use this to preview key codes
    }

    if (key == '\r') {
      return callback('return');
    }
    if (key == '\t') {
      return callback('tab');
    }
    if (key == '\u001B\u005B\u0041') {
      return callback('up');
    }
    if (key == '\u001B\u005B\u0043') {
      return callback('right');
    }
    if (key == '\u001B\u005B\u0042') {
      return callback('down');
    }
    if (key == '\u001B\u005B\u0044') {
      return callback('left');
    }
    if (key == ' ') {
      return callback('space');
    }
    if (key === '\u001b') {
      return callback('esc');
    }

    // ctrl-c
    if (key == '\u0003') {
      return process.exit();
    }

    // fallback (any normal letter/number/symbol)
    if (key.length === 1) {
      return callback(key);
    }
  };

  const start = () => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', listenFn);
    process.stdout.write('\x1B[?25l'); // hide cursor
  };

  const stop = () => {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    process.stdin.off('data', listenFn);
    process.stdout.write('\x1B[?25h'); // show cursor
  };

  if (isStart) start();

  return {
    start,
    stop
  };
};
