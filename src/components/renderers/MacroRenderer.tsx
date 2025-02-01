import React from 'react';
import { Play, CheckCircle, AlertCircle, Clock, ArrowRight, Plus, Trash, Edit2, Save, X } from 'lucide-react';
import { MacroArtifact, ArtifactType } from '../../types/artifacts';
import { useArtifactStore } from '../../store/useArtifactStore';
import { useTemplateStore } from '../../store/useTemplateStore';
import { MacroStepEditor } from './macro/MacroStepEditor';
import { extractArtifactContent } from '../../services/artifacts/utils/contentExtractor';
import { typeConfig } from '../../config/artifactTypes';
import { artifactTypes } from '../../config/artifactTypes';

interface MacroRendererProps {
  data: MacroArtifact;
}

interface EditingStep {
  index: number;
  type: ArtifactType;
  prompt: string;
}

export const MacroRenderer: React.FC<MacroRendererProps> = ({ data }) => {
  const { generateArtifact, updateArtifact } = useArtifactStore();
  const { templates } = useTemplateStore();
  const [isRunning, setIsRunning] = React.useState(false);
  const [editingStep, setEditingStep] = React.useState<EditingStep | null>(null);
  const [newStep, setNewStep] = React.useState<{ type: ArtifactType; prompt: string } | null>(null);

  const handleAddStep = () => {
    setNewStep({ type: 'document', prompt: '' });
  };

  const handleSaveNewStep = () => {
    if (!newStep || !newStep.prompt.trim()) return;

    updateArtifact({
      ...data,
      steps: [...data.steps, { type: newStep.type, prompt: newStep.prompt }]
    });
    setNewStep(null);
  };

  const handleEditStep = (index: number) => {
    const step = data.steps[index];
    setEditingStep({ index, type: step.type, prompt: step.prompt });
  };

  const handleSaveEdit = () => {
    if (!editingStep || !editingStep.prompt.trim()) return;

    updateArtifact({
      ...data,
      steps: data.steps.map((step, i) =>
        i === editingStep.index
          ? { ...step, type: editingStep.type, prompt: editingStep.prompt }
          : step
      )
    });
    setEditingStep(null);
  };

  const handleDeleteStep = (index: number) => {
    updateArtifact({
      ...data,
      steps: data.steps.filter((_, i) => i !== index)
    });
  };

  const runMacro = async () => {
    if (isRunning) return;
    setIsRunning(true);
    let currentStepIndex = 0;
    let knowledgeBase = [...(data.knowledge || [])];

    try {
      let previousContent = '';
      
      for (let i = 0; i < data.steps.length; i++) {
        currentStepIndex = i;
        const step = data.steps[i];
        
        // Update UI to show current step
        updateArtifact({
          ...data,
          currentStep: i,
          steps: data.steps.map((s, idx) => ({
            ...s,
            completed: idx < i
          }))
        });

        try {
          let prompt = step.prompt;
          
          // Add knowledge base context if available
          if (knowledgeBase.length > 0) {
            prompt = `${prompt}\n\nKnowledge Base:\n${knowledgeBase.join('\n---\n')}`;
          }
          
          // Only add previous content if it's not already in knowledge base
          if (previousContent && !data.steps[i - 1]?.addToKnowledge) {
            prompt = `${prompt}\n\nPrevious step output:\n${previousContent}`;
          }
          
          // Get template if specified
          const template = step.templateId ? templates.find(t => t.id === step.templateId) : null;
          if (template) {
            prompt = `${prompt}\n\nTemplate Structure:\n${template.content}`;
          }

          const artifact = await generateArtifact(prompt, step.type, {
            content: prompt,
            isUser: true,
            isMacroStep: true,
            templateId: step.templateId,
            references: template ? [{
              type: 'template',
              title: template.name,
              artifactType: template.type
            }] : undefined
          });
          
          // Special handling for code artifacts
          if (step.type === 'code') {
            // Execute the code
            const codeArtifact = artifact as CodeArtifact;
            try {
              // Create a function from the source code
              const fn = new Function('inputs', codeArtifact.source);
              
              // Run the code with default input values
              const inputs = codeArtifact.inputs?.reduce((acc, input) => ({
                ...acc,
                [input.id]: input.defaultValue
              }), {}) || {};
              
              const output = await fn(inputs);
              
              // Update the artifact with execution result
              artifact.lastResult = {
                output: String(output),
                timestamp: new Date().toISOString()
              };
              
              previousContent = `Code execution result:\n${output}`;
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Code execution failed';
              artifact.lastResult = {
                output: '',
                error: errorMessage,
                timestamp: new Date().toISOString()
              };
              previousContent = `Code execution error:\n${errorMessage}`;
            }
          } else {
            previousContent = extractArtifactContent(artifact) || '';
          }
          
          // Add to knowledge base if configured
          if (step.addToKnowledge && previousContent) {
            knowledgeBase.push(previousContent);
          }

          // Mark step as completed
          updateArtifact({
            ...data,
            knowledge: knowledgeBase,
            steps: data.steps.map((s, idx) => ({
              ...s,
              completed: idx <= i,
              artifactId: idx === i ? artifact.id : s.artifactId
            }))
          });
        } catch (error) {
          // Mark step as failed
          updateArtifact({
            ...data,
            status: 'error',
            error: error instanceof Error ? error.message : 'Step failed',
            steps: data.steps.map((s, idx) => ({
              ...s,
              completed: idx < i,
              error: idx === i ? error instanceof Error ? error.message : 'Step failed' : undefined
            }))
          });
          throw error;
        }
      }
      
      // Mark macro as completed
      updateArtifact({
        ...data,
        status: 'completed',
        steps: data.steps.map(s => ({ ...s, completed: true }))
      });
    } catch (error) {
      console.error('Macro execution failed:', error);
      updateArtifact({
        ...data,
        status: 'error',
        error: error instanceof Error ? error.message : 'Macro execution failed'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStepIcon = (type: ArtifactType) => {
    const Icon = typeConfig[type].icon;
    return <Icon size={20} />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{data.title}</h2>
            <div className="space-y-4">
              {data.description && (
                <p className="text-gray-600">{data.description}</p>
              )}
              {data.knowledge?.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-purple-900 mb-2">Knowledge Base</h3>
                  <div className="space-y-2">
                    {data.knowledge.map((item, index) => (
                      <div key={index} className="bg-white rounded p-3 text-sm text-gray-700">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={runMacro}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300"
          >
            <Play size={20} />
            <span>{isRunning ? 'Running...' : 'Run Macro'}</span>
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
        {data.steps.map((step, index) => {
          const Icon = typeConfig[step.type].icon;
          const isCurrentStep = data.currentStep === index;
          const isCompleted = step.completed;
          const isEditing = editingStep?.index === index;
          
          return (
            <div
              key={index}
              className={`p-4 flex items-center gap-4 ${
                isCurrentStep ? 'bg-purple-50' : ''
              }`}
            >
              {isEditing ? (
                <select
                  value={editingStep.type}
                  onChange={(e) => setEditingStep({
                    ...editingStep,
                    type: e.target.value as ArtifactType
                  })}
                  className="p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                >
                  {artifactTypes.filter(t => t !== 'macro').map(type => (
                    <option key={type} value={type}>{typeConfig[type].label}</option>
                  ))}
                </select>
              ) : (
                <div className={`p-2 rounded-lg ${typeConfig[step.type].color}`}>
                  {getStepIcon(step.type)}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <MacroStepEditor
                    step={step}
                    onUpdate={(updatedStep) => {
                      const updatedSteps = [...data.steps];
                      updatedSteps[index] = updatedStep;
                      updateArtifact({
                        ...data,
                        steps: updatedSteps
                      });
                    }}
                  />
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        Step {index + 1}
                      </span>
                      <ArrowRight size={16} className="text-gray-400" />
                      <span className={typeConfig[step.type].color}>
                        {step.type}
                      </span>
                      {step.templateId && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          Template: {templates.find(t => t.id === step.templateId)?.name}
                        </span>
                      )}
                      {step.addToKnowledge && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Adds to Knowledge
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-gray-600">{step.prompt}</p>
                  </>
                )}
                {isEditing && (
                  <div className="mt-2">
                    <label className="inline-flex items-center text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={step.addToKnowledge}
                        onChange={(e) => {
                          const updatedSteps = [...data.steps];
                          updatedSteps[index] = {
                            ...step,
                            addToKnowledge: e.target.checked
                          };
                          updateArtifact({
                            ...data,
                            steps: updatedSteps
                          });
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                      />
                      Add output to Knowledge Base
                    </label>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 flex items-center gap-2">
                {isCompleted ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : isCurrentStep && isRunning ? (
                  <Clock className="text-purple-500 animate-spin" size={20} />
                ) : step.error ? (
                  <AlertCircle className="text-red-500" size={20} />
                ) : (
                  <>
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => setEditingStep(null)}
                          className="p-1 text-gray-600 hover:text-gray-700"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStep(index)}
                          className="p-1 text-gray-600 hover:text-gray-700"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteStep(index)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash size={18} />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Add New Step Form */}
        {newStep ? (
          <div className="p-4 flex items-center gap-4">
            <select
              value={newStep.type}
              onChange={(e) => {
                if (newStep) {
                  setNewStep({
                    ...newStep,
                    type: e.target.value as ArtifactType
                  });
                }
              }}
              className="p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
            >
              {artifactTypes.filter(t => t !== 'macro').map(type => (
                <option key={type} value={type}>{typeConfig[type].label}</option>
              ))}
            </select>
            
            <div className="flex-1 min-w-0">
              <textarea
                value={newStep?.prompt || ''}
                onChange={(e) => {
                  if (newStep) {
                    setNewStep({
                      ...newStep,
                      prompt: e.target.value
                    });
                  }
                }}
                placeholder="Enter step instructions..."
                className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
              <div className="mt-2">
                <label className="inline-flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={newStep?.addToKnowledge || false}
                    onChange={(e) => {
                      if (newStep) {
                        setNewStep({
                          ...newStep,
                          addToKnowledge: e.target.checked
                        });
                      }
                    }}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                  />
                  Add output to Knowledge Base
                </label>
              </div>
            </div>
            
            <div className="flex-shrink-0 flex items-center gap-2">
              <button
                onClick={handleSaveNewStep}
                className="p-1 text-green-600 hover:text-green-700"
              >
                <Save size={18} />
              </button>
              <button
                onClick={() => setNewStep(null)}
                className="p-1 text-gray-600 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleAddStep}
            className="w-full p-4 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Plus size={20} />
            <span>Add Step</span>
          </button>
        )}
      </div>
    </div>
  );
}