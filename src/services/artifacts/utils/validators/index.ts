@@ .. @@
 import { validateVoiceArtifact } from './voice';
 import { validateMacroArtifact } from './macro';
 import { validateCodeArtifact } from './code';
+import { validateRemoteArtifact } from './remote';

@@ .. @@
     case 'code':
       validateCodeArtifact(data);
       break;
+    case 'remote':
+      validateRemoteArtifact(data);
+      break;