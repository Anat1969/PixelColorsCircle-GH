import { useColorWheel } from '@/hooks/useColorWheel';
import ColorWheel from '@/components/ColorWheel';
import WheelControls from '@/components/WheelControls';
import ColorAnalysis from '@/components/ColorAnalysis';
import PaletteLibrary from '@/components/PaletteLibrary';
import PageLayout, { PageHeader } from '@/components/PageLayout';

const Index = () => {
  const wheel = useColorWheel();

  return (
    <PageLayout title="גלגל הצבעים" wide>
      <PageHeader kicker="כלי · גלגל הצבעים של ניוטון"
        title="גלגל הצבעים של ניוטון"
        lead={<>12 גוונים ב־4 טבעות בהירות. פותחים חורים במסכה, מסובבים אותה, והכלי מחשב מיד הרמוניה, טמפרטורה וניגודיות. הקישור שבתפריט A&amp;I משתף את הפלטה בדיוק כפי שהיא.</>} />

      {/* Mobile order: wheel, controls, palette, report. Desktop: controls in a sticky column. */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(320px,400px)_minmax(0,1fr)] lg:gap-6">
        <div className="newton-panel min-w-0 p-3 md:p-4 lg:col-start-2 lg:row-start-1">
          <ColorWheel
            rotationOffset={wheel.rotationOffset}
            isOpened={wheel.isOpened}
            canSelectByMode={wheel.canSelectByMode}
            onCellClick={wheel.onCellClick}
            selectionLimit={wheel.selectionLimit}
            openedCount={wheel.opened.length}
            maskOpacity={wheel.maskOpacity}
          />
        </div>

        <WheelControls
          selectionLimit={wheel.selectionLimit}
          mode={wheel.mode}
          openedCount={wheel.opened.length}
          structureName={wheel.structureName}
          historyLength={wheel.history.length}
          maskOpacity={wheel.maskOpacity}
          rotationOffset={wheel.rotationOffset}
          onChangeLimit={wheel.changeLimit}
          onSetMode={wheel.setMode}
          onRotateForward={wheel.rotateForward}
          onRotateBack={wheel.rotateBack}
          onReset={wheel.resetHoles}
          onNewPattern={wheel.newPattern}
          onUndo={wheel.undo}
          onMaskOpacityChange={wheel.setMaskOpacity}
        />

        <div className="min-w-0 lg:col-start-2">
          <PaletteLibrary
            revealedColors={wheel.revealedColors}
            harmony={wheel.harmony}
            snapshot={wheel.snapshot}
            saved={wheel.saved}
            onLoad={wheel.load}
          />
        </div>

        <div className="min-w-0 lg:col-start-2">
          <ColorAnalysis
            analysis={wheel.analysis}
            harmony={wheel.harmony}
            revealedColors={wheel.revealedColors}
            decomposition={wheel.decomposition}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
