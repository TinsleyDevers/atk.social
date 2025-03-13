// (old component for placeholder images)
import Image from "next/image";

interface PlaceholderImageProps {
  width: number;
  height: number;
  alt: string;
  className?: string;
  fill?: boolean;
  src: string;
}

const PlaceholderImage = ({
  width,
  height,
  alt,
  className,
  fill = false,
}: PlaceholderImageProps) => {
  // Generate a color based on the alt text for consistent but unique placeholders
  const color = stringToColor(alt);
  const textColor = getContrastColor(color);

  // Build the URL for a colored placeholder with text
  const imageUrl = `https://placehold.co/${width}x${height}/${color.replace(
    "#",
    ""
  )}/${textColor.replace("#", "")}?text=${encodeURIComponent(alt)}`;

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className={className || "object-cover"}
        />
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

// Helper function to generate a color from a string
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

// Helper function to determine contrasting text color
function getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on background luminance
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export default PlaceholderImage;
