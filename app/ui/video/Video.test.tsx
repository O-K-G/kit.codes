import { render } from "@testing-library/react";
import Video from "./Video";

describe("Video", () => {
  it("renders a <video> element", () => {
    const { container } = render(
      <Video primarySrc="/video.mp4" primarySrcType="video/mp4" />,
    );
    expect(container.querySelector("video")).toBeInTheDocument();
  });

  it("renders a primary <source> with the given src and type", () => {
    const { container } = render(
      <Video primarySrc="/video.mp4" primarySrcType="video/mp4" />,
    );
    const source = container.querySelector("source");
    expect(source).toHaveAttribute("src", "/video.mp4");
    expect(source).toHaveAttribute("type", "video/mp4");
  });

  it("does not render a backup <source> when backupSrc is not provided", () => {
    const { container } = render(
      <Video primarySrc="/video.mp4" primarySrcType="video/mp4" />,
    );
    expect(container.querySelectorAll("source")).toHaveLength(1);
  });

  it("renders a backup <source> when backupSrc is provided", () => {
    const { container } = render(
      <Video
        primarySrc="/video.mp4"
        primarySrcType="video/mp4"
        backupSrc="/video.webm"
        backupSrcType="video/webm"
      />,
    );
    expect(container.querySelectorAll("source")).toHaveLength(2);
  });

  it("sets the backup source's src and type correctly", () => {
    const { container } = render(
      <Video
        primarySrc="/video.mp4"
        primarySrcType="video/mp4"
        backupSrc="/video.webm"
        backupSrcType="video/webm"
      />,
    );
    const sources = container.querySelectorAll("source");
    expect(sources[1]).toHaveAttribute("src", "/video.webm");
    expect(sources[1]).toHaveAttribute("type", "video/webm");
  });

  it("defaults data-default-styles to true", () => {
    const { container } = render(
      <Video primarySrc="/video.mp4" primarySrcType="video/mp4" />,
    );
    expect(container.querySelector("video")).toHaveAttribute(
      "data-default-styles",
      "true",
    );
  });

  it("sets data-default-styles to false when isDefaultStyles=false", () => {
    const { container } = render(
      <Video
        primarySrc="/video.mp4"
        primarySrcType="video/mp4"
        isDefaultStyles={false}
      />,
    );
    expect(container.querySelector("video")).toHaveAttribute(
      "data-default-styles",
      "false",
    );
  });

  it("applies a custom className alongside the default styles", () => {
    const { container } = render(
      <Video
        primarySrc="/video.mp4"
        primarySrcType="video/mp4"
        className="custom-class"
      />,
    );
    expect(container.querySelector("video")).toHaveClass("custom-class");
  });

  it("passes through native video attributes like autoPlay/muted/loop", () => {
    const { container } = render(
      <Video
        primarySrc="/video.mp4"
        primarySrcType="video/mp4"
        autoPlay
        muted
        loop
      />,
    );
    const video = container.querySelector("video") as HTMLVideoElement;
    expect(video).toHaveAttribute("autoplay");
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute("loop");
  });

  it("passes through arbitrary rest props such as data-testid", () => {
    const { getByTestId } = render(
      <Video
        primarySrc="/video.mp4"
        primarySrcType="video/mp4"
        data-testid="my-video"
      />,
    );
    expect(getByTestId("my-video")).toBeInTheDocument();
  });

  it("renders without a backupSrcType when backupSrc is provided without backupSrcType", () => {
    const { container } = render(
      <Video
        primarySrc="/video.mp4"
        primarySrcType="video/mp4"
        backupSrc="/video.webm"
      />,
    );
    const sources = container.querySelectorAll("source");
    expect(sources[1]).toHaveAttribute("src", "/video.webm");
    expect(sources[1]).not.toHaveAttribute("type");
  });
});
