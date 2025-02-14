import fs from 'fs';
import { ANT, ArweaveSigner } from '@ar.io/sdk';

async function updateArns() {
    try {
        // Check for wallet.json
        if (!fs.existsSync('./wallet.json')) {
            throw new Error('wallet.json not found in the root of your project');
        }
        
        // Check for manifest.json
        if (!fs.existsSync('./manifest.json')) {
            throw new Error('manifest.json not found. Please run `pnpm deploy` first');
        }

        const jwk = JSON.parse(fs.readFileSync('./wallet.json', 'utf8'));
        const manifest = JSON.parse(fs.readFileSync('./manifest.json', 'utf8'));
        
        if (!manifest.id) {
            throw new Error('No manifest ID found in manifest.json. Please deploy your site first');
        }

        console.log(`Using manifest ID: ${manifest.id}`);

        const ant = ANT.init({
            signer: new ArweaveSigner(jwk),
            // Using the processId from the docs example
            processId: '_d06OmgwYAuReZz0eG8gzMeTOEf6mvxcTS0CT_6ZD9A'
        });

        // Using setRecord instead of setBaseNameRecord as per docs
        const { id: txId } = await ant.setRecord(
            {
                undername: '@',  // @ represents the top level name
                transactionId: manifest.id,
                ttlSeconds: 900 // 15 minutes
            },
            {
                tags: [{
                    name: 'App-Name',
                    value: 'arweave-starter-kit'
                }]
            }
        );

        console.log('\nARNS Update Complete! 🎉');
        console.log(`Transaction ID: ${txId}`);
        console.log(`View your deployment at: https://testing-testing-123.ar.io\n`);
    } catch (error) {
        console.error('Failed to update ARNS:', error);
        process.exit(1);
    }
}

updateArns();
