import sys
import time
import logging
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler
from make_site import build

class BuildSiteEventHandler(PatternMatchingEventHandler):
    """Build the site."""

    def on_any_event(self, event):
        super(PatternMatchingEventHandler, self).on_any_event(event)

        build()

    def on_moved(self, event):
        super(PatternMatchingEventHandler, self).on_moved(event)

        what = 'directory' if event.is_directory else 'file'
        logging.info("Moved %s: from %s to %s", what, event.src_path,
                     event.dest_path)

    def on_created(self, event):
        super(PatternMatchingEventHandler, self).on_created(event)

        what = 'directory' if event.is_directory else 'file'
        logging.info("Created %s: %s", what, event.src_path)

    def on_deleted(self, event):
        super(PatternMatchingEventHandler, self).on_deleted(event)

        what = 'directory' if event.is_directory else 'file'
        logging.info("Deleted %s: %s", what, event.src_path)

    def on_modified(self, event):
        super(PatternMatchingEventHandler, self).on_modified(event)

        what = 'directory' if event.is_directory else 'file'
        logging.info("Modified %s: %s", what, event.src_path)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S')
    path = sys.argv[1] if len(sys.argv) > 1 else '.'
    event_handler = BuildSiteEventHandler(ignore_patterns=["./_site", "./_site/*", "./.git", "./.git/*", "./venv/*"])
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()