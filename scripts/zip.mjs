import { readFile, readdir, lstat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { crc32, deflateRawSync } from 'node:zlib';

// ZIP/deflate using only Node.js: no shell tools and no third-party archiver.
export async function zipDirectory(root, destination) {
  const entries=[];
  async function visit(directory,prefix=''){
    for(const name of (await readdir(directory)).sort()){
      const source=join(directory,name);
      const info=await lstat(source);
      if(info.isSymbolicLink())throw new Error('Exportação não aceita links simbólicos: '+source);
      const relative=prefix+name;
      if(info.isDirectory())await visit(source,relative+'/');
      else if(info.isFile())entries.push({name:relative,data:await readFile(source)});
    }
  }
  await visit(root);
  if(entries.length>65535)throw new Error('Arquivo excede limite do formato ZIP simples.');
  const local=[],central=[];
  let offset=0;
  for(const entry of entries){
    const filename=Buffer.from(entry.name,'utf8');
    const compressed=deflateRawSync(entry.data,{level:6});
    const checksum=crc32(entry.data)>>>0;
    const header=Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50,0);
    header.writeUInt16LE(20,4);
    header.writeUInt16LE(0x800,6);
    header.writeUInt16LE(8,8);
    header.writeUInt16LE(33,12);
    header.writeUInt32LE(checksum,14);
    header.writeUInt32LE(compressed.length,18);
    header.writeUInt32LE(entry.data.length,22);
    header.writeUInt16LE(filename.length,26);
    const record=Buffer.alloc(46);
    record.writeUInt32LE(0x02014b50,0);
    record.writeUInt16LE(20,4);
    record.writeUInt16LE(20,6);
    record.writeUInt16LE(0x800,8);
    record.writeUInt16LE(8,10);
    record.writeUInt16LE(33,14);
    record.writeUInt32LE(checksum,16);
    record.writeUInt32LE(compressed.length,20);
    record.writeUInt32LE(entry.data.length,24);
    record.writeUInt16LE(filename.length,28);
    record.writeUInt32LE(offset,42);
    local.push(header,filename,compressed);
    central.push(record,filename);
    offset+=header.length+filename.length+compressed.length;
  }
  const directory=Buffer.concat(central);
  const end=Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50,0);
  end.writeUInt16LE(entries.length,8);
  end.writeUInt16LE(entries.length,10);
  end.writeUInt32LE(directory.length,12);
  end.writeUInt32LE(offset,16);
  await writeFile(destination,Buffer.concat([...local,directory,end]));
  return entries.length;
}
