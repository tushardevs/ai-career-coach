"use client";

import { useEffect } from "react";

export default function ViewCounter({ slug }) {
  useEffect(() => {
    // Increment view count when component mounts
    const incrementView = async () => {
      try {
        await fetch(`/api/blog/${slug}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error updating view count:', error);
      }
    };

    incrementView();
  }, [slug]);

  return null; // This component doesn't render anything
}
