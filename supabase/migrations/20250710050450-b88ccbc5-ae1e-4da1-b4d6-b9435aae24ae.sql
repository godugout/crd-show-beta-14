-- Create a new full-bleed photo frame with proper UUID
INSERT INTO public.crd_frames (
  id,
  name,
  description,
  category,
  frame_config,
  is_public,
  preview_image_url,
  tags,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Full Bleed Photo - Standard Back',
  'Clean full-surface photo layout with standard CRD back design. Perfect for showcasing high-quality images without any frame borders.',
  'Photography',
  '{
    "dimensions": {
      "width": 225,
      "height": 315,
      "units": "px",
      "dpi": 90,
      "print_width": 2.5,
      "print_height": 3.5,
      "print_units": "inches"
    },
    "regions": [
      {
        "id": "main_photo",
        "name": "Main Photo",
        "type": "photo",
        "bounds": {
          "x": 0,
          "y": 0,
          "width": 225,
          "height": 315
        },
        "shape": "rectangle",
        "constraints": {
          "aspectRatio": 0.714,
          "minSize": {
            "width": 225,
            "height": 315
          },
          "maxSize": {
            "width": 225,
            "height": 315
          },
          "maintainAspectRatio": false,
          "allowResize": false
        },
        "styling": {
          "border": {
            "width": 0,
            "style": "none",
            "color": "transparent",
            "radius": 8
          },
          "background": {
            "type": "transparent",
            "value": "transparent"
          },
          "clipPath": null
        },
        "cropSettings": {
          "enabled": true,
          "allowRotation": true,
          "allowBackgroundRemoval": false,
          "smartCrop": true,
          "faceDetection": true
        }
      }
    ],
    "elements": [
      {
        "id": "back_logo",
        "type": "text",
        "name": "CRD Logo",
        "properties": {
          "content": "CRD",
          "font": {
            "family": "Arial, sans-serif",
            "size": 24,
            "weight": 700
          },
          "color": "#ffffff",
          "position": {
            "x": 112.5,
            "y": 40
          },
          "size": {
            "width": 60,
            "height": 30
          },
          "opacity": 0.9,
          "rotation": 0
        },
        "behavior": {
          "responsive": true,
          "interactive": false,
          "animated": false,
          "conditional": {
            "showOnFront": false,
            "showOnBack": true
          }
        },
        "variations": []
      },
      {
        "id": "back_pattern",
        "type": "image",
        "name": "Background Pattern",
        "properties": {
          "src": "data:image/svg+xml,%3Csvg width=\"225\" height=\"315\" viewBox=\"0 0 225 315\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"225\" height=\"315\" fill=\"%23000000\"/%3E%3Cpath d=\"M0 0L225 315M225 0L0 315\" stroke=\"%23333333\" stroke-width=\"0.5\" opacity=\"0.3\"/%3E%3C/svg%3E",
          "alt": "CRD Background Pattern",
          "position": {
            "x": 0,
            "y": 0
          },
          "size": {
            "width": 225,
            "height": 315
          },
          "opacity": 1,
          "rotation": 0
        },
        "behavior": {
          "responsive": true,
          "interactive": false,
          "animated": false,
          "conditional": {
            "showOnFront": false,
            "showOnBack": true
          }
        },
        "variations": []
      },
      {
        "id": "back_text",
        "type": "text", 
        "name": "Card Description",
        "properties": {
          "content": "Professional Trading Card",
          "font": {
            "family": "Arial, sans-serif",
            "size": 12,
            "weight": 400
          },
          "color": "#cccccc",
          "position": {
            "x": 112.5,
            "y": 280
          },
          "size": {
            "width": 180,
            "height": 20
          },
          "opacity": 0.8,
          "rotation": 0
        },
        "behavior": {
          "responsive": true,
          "interactive": false,
          "animated": false,
          "conditional": {
            "showOnFront": false,
            "showOnBack": true
          }
        },
        "variations": []
      }
    ]
  }',
  true,
  null,
  ARRAY['photography', 'full-bleed', 'clean', 'minimal', 'professional'],
  now(),
  now()
);