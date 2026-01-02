import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { Task } from '../models/task.types';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] || '' });
  }

  async analyzeWorkflow(tasks: Task[], velocity: number): Promise<string> {
    try {
      const model = this.ai.models;
      const tasksJson = JSON.stringify(tasks.map(t => ({
        title: t.title,
        status: t.status,
        priority: t.priority,
        effort: t.effort,
        timeInStatus: t.startedAt && t.status === 'in-progress' ? ((Date.now() - t.startedAt) / 3600000).toFixed(1) + ' hours' : 'N/A'
      })));

      const prompt = `
        Act as a productivity coach. Here is the current state of a user's task board (FocusFlow).
        Current Velocity (tasks/hour): ${velocity}.
        Tasks: ${tasksJson}

        Analyze the workflow for:
        1. Bottlenecks (too many items in progress or review).
        2. Burnout risks (tasks taking longer than effort estimates).
        3. Prioritization alignment.

        Provide a concise, motivating, and actionable advice paragraph (max 100 words).
      `;

      const response = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      console.error('AI Analysis failed', error);
      return 'Could not generate insights at this time. Please check your API configuration.';
    }
  }
}