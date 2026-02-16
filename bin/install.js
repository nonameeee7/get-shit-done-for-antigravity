#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

const pkg = require('../package.json');

const args = process.argv.slice(2);
const hasGlobal = args.includes('--global') || args.includes('-g');
const hasLocal = args.includes('--local') || args.includes('-l');
const hasUninstall = args.includes('--uninstall') || args.includes('-u');
const hasHelp = args.includes('--help') || args.includes('-h');
const hasVersion = args.includes('--version') || args.includes('-v');

function getAgentDir() {
  return '.agent';
}

function getGlobalDir() {
  return path.join(os.homedir(), '.agent');
}

const banner = '\n' +
  cyan + '   ██████╗ ███████╗██████╗\n' +
  '  ██╔════╝ ██╔════╝██╔══██╗\n' +
  '  ██║  ███╗███████╗██║  ██║\n' +
  '  ██║   ██║╚════██║██║  ██║\n' +
  '  ╚██████╔╝███████║██████╔╝\n' +
  '   ╚═════╝ ╚══════╝╚═════╝' + reset + '\n' +
  '\n' +
  '  Get Shit Done ' + dim + 'v' + pkg.version + reset + '\n' +
  '  Spec-driven development for Antigravity\n';

console.log(banner);

if (hasVersion) {
  console.log(`  ${green}v${pkg.version}${reset}`);
  process.exit(0);
}

if (hasHelp) {
  console.log(`  ${yellow}Usage:${reset} npx gsd-kit [options]

  ${yellow}Options:${reset}
    ${cyan}-g, --global${reset}              Install globally (to ~/.agent)
    ${cyan}-l, --local${reset}               Install locally (to ./.agent)
    ${cyan}-u, --uninstall${reset}           Uninstall GSD (remove all GSD files)
    ${cyan}-v, --version${reset}             Show version
    ${cyan}-h, --help${reset}                Show this help message

  ${yellow}Examples:${reset}
    ${dim}# Install globally for Antigravity${reset}
    npx gsd-kit --global

    ${dim}# Install locally (current project)${reset}
    npx gsd-kit --local

    ${dim}# Uninstall${reset}
    npx gsd-kit --uninstall --global

`);
  process.exit(0);
}

function expandTilde(filePath) {
  if (filePath && filePath.startsWith('~/')) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  return filePath;
}

function verifyInstalled(dirPath, description) {
  if (!fs.existsSync(dirPath)) {
    console.error(`  ${yellow}✗${reset} Failed to install ${description}: directory not created`);
    return false;
  }
  try {
    const entries = fs.readdirSync(dirPath);
    if (entries.length === 0) {
      console.error(`  ${yellow}✗${reset} Failed to install ${description}: directory is empty`);
      return false;
    }
  } catch (e) {
    console.error(`  ${yellow}✗${reset} Failed to install ${description}: ${e.message}`);
    return false;
  }
  return true;
}

function convertCommandToWorkflow(content, workflowName) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) return content;

  const [, frontmatter, body] = frontmatterMatch;
  const fmLines = frontmatter.split('\n');
  const fm = {};

  for (const line of fmLines) {
    const match = line.match(/^(\w[-\w]*):\s*(.*)$/);
    if (match) {
      let value = match[2].trim();
      if (value.includes(',')) {
        value = value.split(',').map(v => v.trim());
      }
      fm[match[1]] = value;
    }
  }

  const agFm = {
    description: fm.description || fm.name || workflowName,
  };

  let newFmStr = '---\n';
  for (const [key, value] of Object.entries(agFm)) {
    newFmStr += `${key}: ${value}\n`;
  }
  newFmStr += '---\n\n';

  let newBody = body.trim();
  if (!newBody.includes('$ARGUMENTS')) {
    newBody = '$ARGUMENTS\n\n' + newBody;
  }

  return newFmStr + newBody;
}

function replacePathReferences(content, isGlobal, targetDir) {
  const pathPrefix = isGlobal
    ? targetDir.replace(/\\/g, '/') + '/'
    : './.agent/';

  let result = content;
  result = result.replace(/~\/\.claude\//g, pathPrefix);

  if (!isGlobal) {
    result = result.replace(/~\/\.agent\//g, './.agent/');
  }

  return result;
}

function uninstall(isGlobal) {
  const targetDir = isGlobal
    ? getGlobalDir()
    : path.join(process.cwd(), '.agent');

  const locationLabel = isGlobal
    ? targetDir.replace(os.homedir(), '~')
    : targetDir.replace(process.cwd(), '.');

  console.log(`  Uninstalling GSD from ${cyan}${locationLabel}${reset}\n`);

  if (!fs.existsSync(targetDir)) {
    console.log(`  ${yellow}⚠${reset} Directory does not exist: ${locationLabel}`);
    console.log(`  Nothing to uninstall.\n`);
    return;
  }

  let removedCount = 0;

  const workflowsDir = path.join(targetDir, 'workflows');
  if (fs.existsSync(workflowsDir)) {
    const files = fs.readdirSync(workflowsDir);
    let count = 0;
    for (const file of files) {
      if (file.endsWith('.md') && isGsdWorkflow(file)) {
        fs.unlinkSync(path.join(workflowsDir, file));
        count++;
      }
    }
    if (count > 0) {
      removedCount++;
      console.log(`  ${green}✓${reset} Removed ${count} GSD workflows`);
    }
  }

  const gsdDir = path.join(targetDir, 'get-shit-done');
  if (fs.existsSync(gsdDir)) {
    fs.rmSync(gsdDir, { recursive: true });
    removedCount++;
    console.log(`  ${green}✓${reset} Removed get-shit-done/`);
  }

  const skillsDir = path.join(targetDir, 'skills');
  if (fs.existsSync(skillsDir)) {
    let skillCount = 0;
    const entries = fs.readdirSync(skillsDir);
    for (const entry of entries) {
      if (entry.startsWith('gsd-')) {
        const fullPath = path.join(skillsDir, entry);
        if (fs.statSync(fullPath).isDirectory()) {
          fs.rmSync(fullPath, { recursive: true });
          skillCount++;
        }
      }
    }
    if (skillCount > 0) {
      removedCount++;
      console.log(`  ${green}✓${reset} Removed ${skillCount} GSD skills`);
    }
  }

  const agentsDir = path.join(targetDir, 'agents');
  if (fs.existsSync(agentsDir)) {
    let agentCount = 0;
    const entries = fs.readdirSync(agentsDir);
    for (const entry of entries) {
      if (entry.startsWith('gsd-')) {
        fs.unlinkSync(path.join(agentsDir, entry));
        agentCount++;
      }
    }
    if (agentCount > 0) {
      removedCount++;
      console.log(`  ${green}✓${reset} Removed ${agentCount} GSD agents`);
    }
  }

  if (removedCount === 0) {
    console.log(`  ${yellow}⚠${reset} No GSD files found to remove.`);
  }

  console.log(`
  ${green}Done!${reset} GSD has been uninstalled.
`);
}

function isGsdWorkflow(filename) {
  const gsdWorkflows = [
    'new-project', 'plan-phase', 'execute-phase', 'verify-work',
    'debug', 'discuss-phase', 'research-phase', 'map-codebase',
    'complete-milestone', 'new-milestone', 'progress', 'quick',
    'add-phase', 'remove-phase', 'insert-phase', 'pause-work',
    'resume-work', 'update', 'settings', 'set-profile',
    'audit-milestone', 'plan-milestone-gaps', 'reapply-patches',
    'add-todo', 'check-todos', 'list-phase-assumptions',
    'help', 'join-discord'
  ];
  return gsdWorkflows.some(w => filename.startsWith(w));
}

function copyDirectoryRecursive(src, dest, isGlobal, targetDir) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath, isGlobal, targetDir);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');
      content = replacePathReferences(content, isGlobal, targetDir);
      fs.writeFileSync(destPath, content);
    }
  }
}

function install(isGlobal) {
  const src = path.join(__dirname, '..');
  const targetDir = isGlobal
    ? getGlobalDir()
    : path.join(process.cwd(), '.agent');

  const locationLabel = isGlobal
    ? targetDir.replace(os.homedir(), '~')
    : targetDir.replace(process.cwd(), '.');

  console.log(`  Installing GSD for ${cyan}Antigravity${reset} to ${cyan}${locationLabel}${reset}\n`);

  const failures = [];

  // Install Skills
  const skillsSrc = path.join(src, 'skills');
  if (fs.existsSync(skillsSrc)) {
    const skillsDir = path.join(targetDir, 'skills');
    fs.mkdirSync(skillsDir, { recursive: true });

    const entries = fs.readdirSync(skillsSrc);
    let count = 0;
    for (const entry of entries) {
      const skillPath = path.join(skillsSrc, entry);
      if (fs.statSync(skillPath).isDirectory()) {
        const skillDest = path.join(skillsDir, entry);
        fs.mkdirSync(skillDest, { recursive: true });
        copyDirectoryRecursive(skillPath, skillDest, isGlobal, targetDir);
        count++;
      }
    }
    console.log(`  ${green}✓${reset} Installed ${count} skills`);
  } else {
    failures.push('skills (source not found)');
  }

  // Install Workflows
  const commandsSrc = path.join(src, 'workflows');
  if (fs.existsSync(commandsSrc)) {
    const workflowsDir = path.join(targetDir, 'workflows');
    fs.mkdirSync(workflowsDir, { recursive: true });

    const entries = fs.readdirSync(commandsSrc);
    let count = 0;
    for (const file of entries) {
      if (file.endsWith('.md')) {
        let content = fs.readFileSync(path.join(commandsSrc, file), 'utf8');
        content = convertCommandToWorkflow(content, file);
        content = replacePathReferences(content, isGlobal, targetDir);
        fs.writeFileSync(path.join(workflowsDir, file), content);
        count++;
      }
    }
    console.log(`  ${green}✓${reset} Installed ${count} workflows`);
  } else {
    failures.push('workflows (source not found)');
  }

  // Install Agents
  const agentsSrc = path.join(src, 'agents');
  if (fs.existsSync(agentsSrc)) {
    const agentsDir = path.join(targetDir, 'agents');
    fs.mkdirSync(agentsDir, { recursive: true });

    const entries = fs.readdirSync(agentsSrc);
    let count = 0;
    for (const file of entries) {
      if (file.endsWith('.md')) {
        let content = fs.readFileSync(path.join(agentsSrc, file), 'utf8');
        content = replacePathReferences(content, isGlobal, targetDir);
        fs.writeFileSync(path.join(agentsDir, file), content);
        count++;
      }
    }
    console.log(`  ${green}✓${reset} Installed ${count} agents`);
  }

  // Copy get-shit-done resources
  const gsdSrc = path.join(src, 'get-shit-done');
  const gsdDest = path.join(targetDir, 'get-shit-done');
  if (fs.existsSync(gsdSrc)) {
    fs.mkdirSync(gsdDest, { recursive: true });
    copyDirectoryRecursive(gsdSrc, gsdDest, isGlobal, targetDir);
    console.log(`  ${green}✓${reset} Installed get-shit-done resources`);
  } else {
    failures.push('get-shit-done (source not found)');
  }

  // Write VERSION file
  const versionDest = path.join(targetDir, 'get-shit-done', 'VERSION');
  fs.writeFileSync(versionDest, pkg.version);

  if (failures.length > 0) {
    console.error(`\n  ${yellow}Installation incomplete!${reset} Failed: ${failures.join(', ')}`);
    process.exit(1);
  }

  console.log(`
  ${green}Done!${reset} GSD installed for Antigravity.

  ${cyan}Skills:${reset}     ${locationLabel}/skills/gsd-*/
  ${cyan}Workflows:${reset}  ${locationLabel}/workflows/*.md
  ${cyan}Agents:${reset}     ${locationLabel}/agents/*.md
  ${cyan}Resources:${reset}  ${locationLabel}/get-shit-done/

  ${dim}Run /help in Antigravity to see available workflows.${reset}
  ${dim}Join the community: https://discord.gg/5JJgD5svVS${reset}
`);
}

if (hasUninstall) {
  uninstall(hasGlobal);
} else {
  if (!hasGlobal && !hasLocal) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(`  ${yellow}Where would you like to install GSD?${reset}

  ${cyan}1${reset}) Global ${dim}(~/.agent)${reset}
  ${cyan}2${reset}) Local  ${dim}(./.agent)${reset}
`);

    rl.question(`  Choice ${dim}[1]${reset}: `, (answer) => {
      rl.close();
      const choice = answer.trim() || '1';
      if (choice === '1') {
        install(true);
      } else {
        install(false);
      }
    });
  } else {
    install(hasGlobal);
  }
}
