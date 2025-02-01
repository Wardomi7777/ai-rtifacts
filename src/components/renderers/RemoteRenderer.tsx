import React, { useState } from 'react';
import { Play, Eye, EyeOff, Clock, AlertCircle, Check, Wand2, Pencil } from 'lucide-react';
import { RemoteActionArtifact } from '../../types/artifacts';
import { useArtifactStore } from '../../store/useArtifactStore';
import { ArtifactTypeSelector } from '../../components/chat/ArtifactTypeSelector';
import { RemoteAIEdit } from './remote/RemoteAIEdit';

interface RemoteRendererProps {
  data: RemoteActionArtifact;
}

export const RemoteRenderer: React.FC<RemoteRendererProps> = ({ data }) => {
  const { updateArtifact } = useArtifactStore();
  const { generateArtifact } = useArtifactStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState(false);
  const [showTransform, setShowTransform] = useState(false);
  const [showAIEdit, setShowAIEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [authInput, setAuthInput] = useState(data.auth || {
    type: 'bearer',
    token: '',
    username: '',
    password: '',
    key: '',
    value: '',
    in: 'header'
  });

  const executeRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build request URL with query params
      const url = new URL(data.url);
      if (data.queryParams) {
        Object.entries(data.queryParams).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      // Build headers
      const headers = new Headers(data.headers);
      
      // Add auth headers if needed
      if (authInput) {
        switch (authInput.type) {
          case 'bearer':
            if (authInput.token) {
              headers.set('Authorization', `Bearer ${authInput.token}`);
            }
            break;
          case 'basic':
            if (authInput.username && authInput.password) {
              const base64 = btoa(`${authInput.username}:${authInput.password}`);
              headers.set('Authorization', `Basic ${base64}`);
            }
            break;
          case 'apiKey':
            if (authInput.key && authInput.value) {
              if (authInput.in === 'header') {
                headers.set(authInput.key, authInput.value);
              } else {
                url.searchParams.append(authInput.key, authInput.value);
              }
            }
            break;
        }
      }

      // Make the request
      const response = await fetch(url.toString(), {
        method: data.method,
        headers,
        body: data.method !== 'GET' ? data.body : undefined
      });

      // Get response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Get response body
      const responseBody = await response.text();

      // Update artifact with response
      updateArtifact({
        ...data,
        lastResponse: {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          body: responseBody,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Request Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
            {data.description && (
              <p className="mt-1 text-gray-600">{data.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setShowAIEdit(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
            >
              {isEditing ? (
                <>
                  <Eye size={20} />
                  <span>Preview</span>
                </>
              ) : (
                <>
                  <Pencil size={20} />
                  <span>Edit</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setShowAIEdit(!showAIEdit);
                setIsEditing(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-colors"
            >
              <Wand2 size={20} />
              <span>AI Edit</span>
            </button>
            <button
              onClick={executeRequest}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <Clock className="animate-spin" size={20} />
              ) : (
                <Play size={20} />
              )}
              <span>{loading ? 'Executing...' : 'Run'}</span>
            </button>
          </div>
        </div>

        {/* Method and URL */}
        <div className="flex items-center gap-4 mb-6">
          <span className={`px-3 py-1 rounded-lg font-mono text-white ${
            data.method === 'GET' ? 'bg-blue-500' :
            data.method === 'POST' ? 'bg-green-500' :
            data.method === 'PUT' ? 'bg-yellow-500' :
            data.method === 'DELETE' ? 'bg-red-500' :
            'bg-purple-500'
          }`}>
            {data.method}
          </span>
          <code className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm">
            {data.url}
          </code>
        </div>

        {/* Authentication */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication</h3>
          <div className="space-y-4">
            <select
              value={authInput.type}
              onChange={(e) => setAuthInput({ ...authInput, type: e.target.value as any })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="bearer">Bearer Token</option>
              <option value="basic">Basic Auth</option>
              <option value="apiKey">API Key</option>
            </select>

            {authInput.type === 'bearer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bearer Token
                </label>
                <div className="relative">
                  <input
                    type={showSecrets ? 'text' : 'password'}
                    value={authInput.token}
                    onChange={(e) => setAuthInput({ ...authInput, token: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecrets(!showSecrets)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showSecrets ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {authInput.type === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={authInput.username}
                    onChange={(e) => setAuthInput({ ...authInput, username: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets ? 'text' : 'password'}
                      value={authInput.password}
                      onChange={(e) => setAuthInput({ ...authInput, password: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(!showSecrets)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showSecrets ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {authInput.type === 'apiKey' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={authInput.key}
                    onChange={(e) => setAuthInput({ ...authInput, key: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Value
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets ? 'text' : 'password'}
                      value={authInput.value}
                      onChange={(e) => setAuthInput({ ...authInput, value: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(!showSecrets)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showSecrets ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add to
                  </label>
                  <select
                    value={authInput.in}
                    onChange={(e) => setAuthInput({ ...authInput, in: e.target.value as 'header' | 'query' })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="header">Header</option>
                    <option value="query">Query Parameter</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Headers */}
        {data.headers && Object.keys(data.headers).length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Headers</h3>
            {isEditing ? (
              <div className="space-y-2">
                {Object.entries(data.headers).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        const newHeaders = { ...data.headers };
                        delete newHeaders[key];
                        newHeaders[e.target.value] = value;
                        updateArtifact({ ...data, headers: newHeaders });
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      placeholder="Header name"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        updateArtifact({
                          ...data,
                          headers: { ...data.headers, [key]: e.target.value }
                        });
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      placeholder="Header value"
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    updateArtifact({
                      ...data,
                      headers: { ...data.headers, '': '' }
                    });
                  }}
                  className="text-sm text-cyan-600 hover:text-cyan-700"
                >
                  + Add Header
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                {Object.entries(data.headers).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-4">
                    <span className="font-semibold">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Query Parameters */}
        {data.queryParams && Object.keys(data.queryParams).length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Query Parameters</h3>
            {isEditing ? (
              <div className="space-y-2">
                {Object.entries(data.queryParams).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        const newParams = { ...data.queryParams };
                        delete newParams[key];
                        newParams[e.target.value] = value;
                        updateArtifact({ ...data, queryParams: newParams });
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      placeholder="Parameter name"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        updateArtifact({
                          ...data,
                          queryParams: { ...data.queryParams, [key]: e.target.value }
                        });
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      placeholder="Parameter value"
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    updateArtifact({
                      ...data,
                      queryParams: { ...data.queryParams, '': '' }
                    });
                  }}
                  className="text-sm text-cyan-600 hover:text-cyan-700"
                >
                  + Add Parameter
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                {Object.entries(data.queryParams).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-4">
                    <span className="font-semibold">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Request Body */}
        {data.body && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Request Body</h3>
            {isEditing ? (
              <textarea
                value={data.body}
                onChange={(e) => updateArtifact({ ...data, body: e.target.value })}
                className="w-full h-48 px-4 py-3 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            ) : (
              <pre className="bg-gray-50 rounded-lg p-4 overflow-auto">
                <code className="text-sm">{data.body}</code>
              </pre>
            )}
          </div>
        )}

        {/* AI Edit */}
        {showAIEdit && (
          <RemoteAIEdit
            data={data}
            onUpdate={updateArtifact}
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Last Response */}
      {data.lastResponse && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-900">Response</h3>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                data.lastResponse.status >= 200 && data.lastResponse.status < 300
                  ? 'bg-green-100 text-green-800'
                  : data.lastResponse.status >= 400
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                <span>{data.lastResponse.status}</span>
                <span>{data.lastResponse.statusText}</span>
              </div>
              <button
                onClick={() => setShowTransform(!showTransform)}
                className="ml-4 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Wand2 size={16} className="inline-block mr-2" />
                Transform
              </button>
            </div>
            <time className="text-sm text-gray-500">
              {new Date(data.lastResponse.timestamp).toLocaleString()}
            </time>
          </div>

          {showTransform && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Transform to:
              </h4>
              <ArtifactTypeSelector
                selected="document"
                onSelect={async (type) => {
                  if (data.lastResponse) {
                    await generateArtifact(data.lastResponse.body, type);
                    setShowTransform(false);
                  }
                }}
              />
            </div>
          )}
          {/* Response Headers */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Headers</h4>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              {Object.entries(data.lastResponse.headers).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4">
                  <span className="font-semibold">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Response Body */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Body</h4>
            <pre className="bg-gray-50 rounded-lg p-4 overflow-auto">
              <code className="text-sm">{data.lastResponse.body}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};