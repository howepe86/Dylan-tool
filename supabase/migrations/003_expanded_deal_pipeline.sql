-- Expand deal pipeline stages for kanban board
-- This migration adds more granular pipeline stages while maintaining backward compatibility

-- Add new deal status values
ALTER TYPE public.deal_status ADD VALUE IF NOT EXISTS 'lead';
ALTER TYPE public.deal_status ADD VALUE IF NOT EXISTS 'qualified';
ALTER TYPE public.deal_status ADD VALUE IF NOT EXISTS 'proposal';
ALTER TYPE public.deal_status ADD VALUE IF NOT EXISTS 'negotiation';

-- Add stage position and probability fields for better pipeline management
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS stage_position INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS probability_percent INTEGER DEFAULT 0 CHECK (probability_percent >= 0 AND probability_percent <= 100),
ADD COLUMN IF NOT EXISTS expected_close_date DATE,
ADD COLUMN IF NOT EXISTS last_activity_date TIMESTAMPTZ DEFAULT NOW();

-- Create index for better performance on stage queries
CREATE INDEX IF NOT EXISTS deals_status_position_idx ON public.deals (status, stage_position);
CREATE INDEX IF NOT EXISTS deals_expected_close_date_idx ON public.deals (expected_close_date);

-- Update existing deals to have proper stage positions based on current status
-- This maintains backward compatibility
UPDATE public.deals 
SET 
  stage_position = CASE 
    WHEN status = 'pipeline' THEN 1
    WHEN status = 'closed' THEN 5
    WHEN status = 'lost' THEN 6
    ELSE 1
  END,
  probability_percent = CASE 
    WHEN status = 'pipeline' THEN 50
    WHEN status = 'closed' THEN 100
    WHEN status = 'lost' THEN 0
    ELSE 50
  END,
  last_activity_date = created_at
WHERE stage_position = 0;

-- Add trigger to update last_activity_date on deal changes
CREATE OR REPLACE FUNCTION update_deal_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_activity_date = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deals_activity_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW 
  WHEN (OLD.status IS DISTINCT FROM NEW.status OR OLD.stage_position IS DISTINCT FROM NEW.stage_position)
  EXECUTE FUNCTION update_deal_last_activity();